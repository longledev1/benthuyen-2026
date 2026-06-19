/**
 * Loại bỏ dấu tiếng Việt để phục vụ việc so khớp tìm kiếm không dấu
 * Ví dụ: "Liên hệ lần đầu" -> "lien he lan dau"
 */
export const removeTones = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};
