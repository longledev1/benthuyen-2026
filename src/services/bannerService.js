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
  async uploadBanner(file, title, displayOrder = 0, onStatusChange) {
    try {
      if (onStatusChange) onStatusChange("uploading", 20);
      
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
      if (onStatusChange) onStatusChange("uploading", 80);

      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(storagePath);

      const { data: dbData, error: dbError } = await supabase
        .from("banners")
        .insert([
          {
            image_url: publicUrl,
            storage_path: storagePath,
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
  async deleteBanner(id, storagePath) {
    // 1. Xóa trong DB
    const { error: dbError } = await supabase
      .from("banners")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    // 2. Xóa trong Storage
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from("gallery")
        .remove([storagePath]);

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
  }
};
