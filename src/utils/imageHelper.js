import imageCompression from "browser-image-compression";

/**
 * Nén hình ảnh và chuyển đổi sang định dạng WebP
 * @param {File} file - File ảnh gốc
 * @returns {Promise<File>} - File ảnh WebP đã được nén
 */
export const compressToWebP = async (file) => {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    fileType: "image/webp",
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
