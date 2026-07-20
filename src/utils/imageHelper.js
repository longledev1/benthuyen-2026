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
