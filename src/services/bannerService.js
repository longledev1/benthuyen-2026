import supabase from "../lib/supabase";
import { compressToWebP } from "../utils/imageHelper";

export const bannerService = {
  /**
   * Lấy danh sách banner trang chủ tối đa 3 slide
   */
  async fetchBanners() {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(3);

    if (error) throw error;
    return data || [];
  },

  /**
   * Lấy toàn bộ danh sách banner (dành cho Admin quản lý)
   */
  async fetchAllBanners() {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Tải ảnh banner mới lên Supabase Storage và lưu vào database
   * @param {File} file - File gốc (đã được validate kích thước 1920x1080)
   * @param {string} title - Tiêu đề/chú thích của banner
   * @param {number} displayOrder - Thứ tự hiển thị
   * @param {Function} onStatusChange - Callback báo tiến trình upload
   */
  async uploadBanner(file, mobileFile, title, displayOrder = 0, onStatusChange) {
    try {
      if (onStatusChange) onStatusChange("uploading", 10);
      
      // Upload Desktop File
      const fileExt = file.name.split('.').pop() || "png";
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const storagePath = `banners/${uniqueFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) throw uploadError;
      if (onStatusChange) onStatusChange("uploading", 50);

      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(storagePath);

      // Upload Mobile File nếu có
      let mobilePublicUrl = null;
      let mobileStoragePath = null;

      if (mobileFile) {
        const mobileFileExt = mobileFile.name.split('.').pop() || "png";
        const mobileUniqueFileName = `mobile-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${mobileFileExt}`;
        mobileStoragePath = `banners/${mobileUniqueFileName}`;

        const { error: mobileUploadError } = await supabase.storage
          .from("gallery")
          .upload(mobileStoragePath, mobileFile, {
            cacheControl: "3600",
            upsert: false
          });

        if (mobileUploadError) throw mobileUploadError;
        
        const { data: { publicUrl: mUrl } } = supabase.storage
          .from("gallery")
          .getPublicUrl(mobileStoragePath);
          
        mobilePublicUrl = mUrl;
      }

      if (onStatusChange) onStatusChange("uploading", 80);
        
      const { data: dbData, error: dbError } = await supabase
        .from("banners")
        .insert([
          {
            image_url: publicUrl,
            storage_path: storagePath,
            mobile_image_url: mobilePublicUrl,
            mobile_storage_path: mobileStoragePath,
            title: title || "",
            display_order: displayOrder,
            is_active: true
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
   * Xóa banner khỏi DB và dọn dẹp file trong Storage
   */
  async deleteBanner(id, storagePath, mobileStoragePath) {
    // 1. Xóa trong DB
    const { error: dbError } = await supabase
      .from("banners")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    // 2. Xóa các file trong Storage
    const pathsToDelete = [];
    if (storagePath) pathsToDelete.push(storagePath);
    if (mobileStoragePath) pathsToDelete.push(mobileStoragePath);

    if (pathsToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("gallery")
        .remove(pathsToDelete);

      if (storageError) {
        console.warn("⚠️ Lỗi dọn dẹp file banner trong Storage:", storageError);
      }
    }
    return true;
  },

  /**
   * Cập nhật thứ tự hiển thị banner
   */
  async updateBannerOrder(id, displayOrder) {
    const { data, error } = await supabase
      .from("banners")
      .update({ display_order: displayOrder })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data ? data[0] : null;
  },

  /**
   * Tải ảnh mobile trực tiếp cho một banner sẵn có
   */
  async updateMobileBanner(bannerId, oldMobileStoragePath, mobileFile) {
    // 1. Xóa file mobile cũ nếu có
    if (oldMobileStoragePath) {
      try {
        await supabase.storage.from("gallery").remove([oldMobileStoragePath]);
      } catch (e) {
        console.warn("Lỗi khi xóa file mobile cũ:", e);
      }
    }

    // 2. Upload file mới
    const fileExt = mobileFile.name.split('.').pop() || "png";
    const mobileUniqueFileName = `mobile-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const mobileStoragePath = `banners/${mobileUniqueFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(mobileStoragePath, mobileFile, {
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("gallery")
      .getPublicUrl(mobileStoragePath);

    // 3. Cập nhật DB
    const { data, error: dbError } = await supabase
      .from("banners")
      .update({
        mobile_image_url: publicUrl,
        mobile_storage_path: mobileStoragePath
      })
      .eq("id", bannerId)
      .select();

    if (dbError) throw dbError;
    return data ? data[0] : null;
  }
};
