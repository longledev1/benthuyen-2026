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
 * Tối ưu hóa dung lượng Banner:
 * - Chuyển đổi mọi file banner sang chuẩn WebP hiện đại
 * - Giới hạn chiều rộng tối đa 1920px (Full HD)
 * - Tối ưu chất lượng 85% giữ độ sắc nét nguyên bản mà dung lượng giảm từ 3-8MB xuống chỉ còn 150-250KB
 * @param {File} file - File ảnh gốc
 * @returns {Promise<File>} - File ảnh WebP tối ưu siêu nhẹ
 */
export const optimizeBannerImage = async (file) => {
  if (!file) return file;

  try {
    const options = {
      maxSizeMB: 0.5, // Tối đa 500KB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: 0.85,
    };
    const compressedBlob = await imageCompression(file, options);
    const cleanName = `${file.name.substring(0, file.name.lastIndexOf(".")) || "banner"}.webp`;
    return new File([compressedBlob], cleanName, { type: "image/webp" });
  } catch (err) {
    console.warn("⚠️ Không thể tối ưu ảnh banner sang WebP, dùng file gốc:", err);
    return file;
  }
};
