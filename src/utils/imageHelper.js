import imageCompression from "browser-image-compression";

/**
 * Nén hình ảnh và chuyển đổi sang định dạng WebP
 * @param {File} file - File ảnh gốc
 * @returns {Promise<File>} - File ảnh WebP đã được nén
 */
export const compressToWebP = async (file) => {
  const options = {
    maxSizeMB: 2.0, // Tăng lên 2MB để tránh nén quá mức làm mất chi tiết
    maxWidthOrHeight: 1920, // Tăng lên độ phân giải 1920px (Full HD) để ảnh sắc nét
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.9, // Độ phân giải khởi đầu 90% cực kỳ sắc nét
  };
  try {
    const compressedBlob = await imageCompression(file, options);
    const cleanName =
      file.name.substring(0, file.name.lastIndexOf(".")) + ".webp";
    return new File([compressedBlob], cleanName, { type: "image/webp" });
  } catch (err) {
    console.error("⚠️ Lỗi nén ảnh:", err);
    return file;
  }
};

/**
 * Tối ưu hóa dung lượng Banner để chống lỗi 408 Request Timeout từ Supabase:
 * - Nếu file <= 3.5MB: Giữ nguyên 100% file gốc.
 * - Nếu file > 3.5MB (Canva PNG nặng 8-20MB): Nén thông minh giữ nguyên kích thước Full HD 1920px và chất lượng 95% cực nét.
 * @param {File} file - File ảnh gốc
 * @returns {Promise<File>} - File ảnh an toàn cho đường truyền
 */
export const optimizeBannerImage = async (file) => {
  if (!file) return file;

  // File nhỏ hơn hoặc bằng 3.5MB là an toàn cho kết nối mạng, giữ nguyên 100%
  if (file.size <= 3.5 * 1024 * 1024) {
    return file;
  }

  try {
    const options = {
      maxSizeMB: 2.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.95,
    };
    const compressedBlob = await imageCompression(file, options);
    const originalExt = file.name.split('.').pop() || "png";
    const fileExt = compressedBlob.type === "image/webp" ? "webp" : originalExt;
    const cleanName = `${file.name.substring(0, file.name.lastIndexOf("."))}.${fileExt}`;
    return new File([compressedBlob], cleanName, { type: compressedBlob.type || file.type });
  } catch (err) {
    console.warn("⚠️ Không thể tối ưu ảnh banner, dùng file gốc:", err);
    return file;
  }
};
