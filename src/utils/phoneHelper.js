/**
 * Chuẩn hóa số điện thoại: Loại bỏ tất cả ký tự không phải số
 * Ví dụ: "090 123 4567" -> "0901234567"
 *        "090.123.4567" -> "0901234567"
 */
export const normalizePhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/[^0-9]/g, "");
};
