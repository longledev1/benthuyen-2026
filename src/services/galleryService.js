import supabase from "../lib/supabase";
import { compressToWebP } from "../utils/imageHelper";

export const galleryService = {
  /**
   * Lấy toàn bộ danh sách hình ảnh từ Supabase
   */
  async fetchGallery() {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Lấy danh sách hình ảnh theo danh mục và định dạng lại phù hợp cho UI
   */
  async fetchGalleryByCategory(categoryKey) {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const DB_CATEGORY_MAP = {
      "history": "history",
      "cuisine": "food",
      "events": "event",
      "lich-su": "history",
      "am-thuc": "food",
      "su-kien": "event"
    };

    const targetDbCategory = DB_CATEGORY_MAP[categoryKey] || categoryKey;
    const filtered = (data || []).filter(item => item.category === targetDbCategory);

    return filtered.map(item => ({
      src: item.url,
      title: item.title,
      description: "" // Ẩn mô tả theo yêu cầu
    }));
  },

  /**
   * Xử lý nén và tải lên 1 hình ảnh lên Storage & Database
   * @param {File} file - File gốc
   * @param {string} category - Danh mục (space | food | event)
   * @param {string} title - Tiêu đề/chú thích ảnh
   * @param {Function} onStatusChange - Callback báo trạng thái (status, progress)
   */
  async uploadImage(file, category, title, onStatusChange) {
    try {
      // 1. Nén ảnh sang WebP
      if (onStatusChange) onStatusChange("compressing", 15);
      const webpFile = await compressToWebP(file);

      // 2. Upload tệp lên Supabase Storage
      if (onStatusChange) onStatusChange("uploading", 40);
      const fileExt = "webp";
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const storagePath = `${category}/${uniqueFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(storagePath, webpFile, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) throw uploadError;
      if (onStatusChange) onStatusChange("uploading", 80);

      // 3. Lấy public URL
      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(storagePath);

      // 4. Lưu bản ghi vào DB
      const { data: dbData, error: dbError } = await supabase
        .from("gallery")
        .insert([
          {
            url: publicUrl,
            category: category,
            title: title,
            storage_path: storagePath
          }
        ])
        .select();

      if (dbError) throw dbError;
      if (onStatusChange) onStatusChange("success", 100);

      return dbData ? dbData[0] : null;
    } catch (err) {
      if (onStatusChange) onStatusChange("error", 0, err.message);
      throw err;
    }
  },

  /**
   * Cập nhật thông tin hình ảnh (bao gồm cả thay ảnh mới nếu có)
   */
  async updateImage(id, title, category, file, oldStoragePath) {
    let newUrl = null;
    let newStoragePath = null;

    // 1. Nếu có file mới, nén và upload lên Storage
    if (file) {
      const webpFile = await compressToWebP(file);
      const fileExt = "webp";
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const storagePath = `${category}/${uniqueFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(storagePath, webpFile, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) throw uploadError;

      newStoragePath = storagePath;

      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(storagePath);

      newUrl = publicUrl;
    }

    // 2. Cập nhật record trong Database
    const updateData = {
      title: title,
      category: category
    };

    if (newUrl) {
      updateData.url = newUrl;
      updateData.storage_path = newStoragePath;
    }

    const { data, error } = await supabase
      .from("gallery")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;

    // 3. Nếu cập nhật DB thành công và có file mới, xóa file cũ trong Storage
    if (newUrl && oldStoragePath) {
      const { error: deleteError } = await supabase.storage
        .from("gallery")
        .remove([oldStoragePath]);

      if (deleteError) {
        console.warn("⚠️ Lỗi xóa file cũ trong Storage khi cập nhật:", deleteError);
      }
    }

    return data ? data[0] : null;
  },

  /**
   * Xóa hình ảnh khỏi Database và dọn dẹp file vật lý trên Storage
   */
  async deleteImage(id, storagePath) {
    // 1. Xóa bản ghi trong Database
    const { error: dbError } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    // 2. Xóa file vật lý trong Storage nếu có đường dẫn
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from("gallery")
        .remove([storagePath]);
        
      if (storageError) {
        console.warn("⚠️ Lỗi dọn dẹp file trong Storage:", storageError);
      }
    }
    
    return true;
  },

  /**
   * Xóa hàng loạt hình ảnh khỏi Database và dọn dẹp Storage
   */
  async deleteMultipleImages(ids, storagePaths) {
    if (!ids || ids.length === 0) return true;

    // 1. Xóa tất cả bản ghi trong Database
    const { error: dbError } = await supabase
      .from("gallery")
      .delete()
      .in("id", ids);

    if (dbError) throw dbError;

    // 2. Xóa tất cả file vật lý trong Storage
    const validPaths = (storagePaths || []).filter(path => !!path);
    if (validPaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("gallery")
        .remove(validPaths);

      if (storageError) {
        console.warn("⚠️ Lỗi dọn dẹp file hàng loạt trong Storage:", storageError);
      }
    }

    return true;
  }
};

export default galleryService;
