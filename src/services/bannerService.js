import supabase from "../lib/supabase";
import { optimizeBannerImage } from "../utils/imageHelper";

/**
 * Helper upload file lên Supabase Storage với retry và contentType rõ ràng
 */
const uploadFileToStorage = async (storagePath, file, maxRetries = 1) => {
  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { error } = await supabase.storage
        .from("gallery")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type || "image/png"
        });

      if (error) throw error;
      return;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        console.warn(`⚠️ Lỗi tải ảnh lên Storage lần ${attempt + 1}, đang thử lại...`, err);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }
  throw lastError;
};

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
   * @param {File} file - File Desktop
   * @param {File} mobileFile - File Mobile
   * @param {string} title - Tiêu đề/chú thích của banner
   * @param {number} displayOrder - Thứ tự hiển thị
   * @param {Function} onStatusChange - Callback báo tiến trình upload
   */
  async uploadBanner(file, mobileFile, title, displayOrder = 0, onStatusChange) {
    try {
      if (onStatusChange) onStatusChange("optimizing", 15);

      // 1. Tối ưu dung lượng ảnh nếu file quá lớn (> 3.5MB từ Canva) để tránh lỗi 408 Timeout
      const [readyDesktopFile, readyMobileFile] = await Promise.all([
        optimizeBannerImage(file),
        mobileFile ? optimizeBannerImage(mobileFile) : Promise.resolve(null)
      ]);

      if (onStatusChange) onStatusChange("uploading", 35);

      // 2. Chuẩn bị đường dẫn Storage
      const desktopExt = readyDesktopFile.name.split('.').pop() || "png";
      const desktopFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${desktopExt}`;
      const storagePath = `banners/${desktopFileName}`;

      let mobileStoragePath = null;
      if (readyMobileFile) {
        const mobileExt = readyMobileFile.name.split('.').pop() || "png";
        const mobileFileName = `mobile-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${mobileExt}`;
        mobileStoragePath = `banners/${mobileFileName}`;
      }

      // 3. Tải song song cả 2 ảnh lên Supabase Storage (rút ngắn 50% thời gian)
      const uploadTasks = [
        uploadFileToStorage(storagePath, readyDesktopFile)
      ];

      if (readyMobileFile && mobileStoragePath) {
        uploadTasks.push(uploadFileToStorage(mobileStoragePath, readyMobileFile));
      }

      await Promise.all(uploadTasks);

      if (onStatusChange) onStatusChange("saving", 85);

      // 4. Lấy Public URL
      const { data: { publicUrl: desktopUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(storagePath);

      let mobileUrl = null;
      if (mobileStoragePath) {
        const { data: { publicUrl: mUrl } } = supabase.storage
          .from("gallery")
          .getPublicUrl(mobileStoragePath);
        mobileUrl = mUrl;
      }

      // 5. Lưu vào Database
      const { data: dbData, error: dbError } = await supabase
        .from("banners")
        .insert([
          {
            image_url: desktopUrl,
            storage_path: storagePath,
            mobile_image_url: mobileUrl,
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
    // 1. Tối ưu ảnh mobile nếu dung lượng > 3.5MB để tránh timeout 408
    const readyMobileFile = await optimizeBannerImage(mobileFile);

    // 2. Xóa file mobile cũ nếu có
    if (oldMobileStoragePath) {
      try {
        await supabase.storage.from("gallery").remove([oldMobileStoragePath]);
      } catch (e) {
        console.warn("Lỗi khi xóa file mobile cũ:", e);
      }
    }

    // 3. Upload file mới
    const fileExt = readyMobileFile.name.split('.').pop() || "png";
    const mobileUniqueFileName = `mobile-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const mobileStoragePath = `banners/${mobileUniqueFileName}`;

    await uploadFileToStorage(mobileStoragePath, readyMobileFile);

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
