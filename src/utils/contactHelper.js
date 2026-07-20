import { normalizePhone } from "./phoneHelper";

/**
 * Helper để kiểm tra SĐT mới hay cũ và tính số lần liên hệ
 * @param {Object} currentContact - Liên hệ hiện tại cần kiểm tra
 * @param {Array} allContacts - Danh sách tất cả liên hệ để đối chiếu
 * @returns {Object} { isNew: boolean, count: number }
 */
export const getPhoneStatus = (currentContact, allContacts) => {
  if (!currentContact || !allContacts || allContacts.length === 0) {
    return { isNew: true, count: 1 };
  }

  // Tìm tất cả liên hệ có cùng số điện thoại (đã chuẩn hóa)
  const cleanCurrentPhone = normalizePhone(currentContact.phone);
  const matches = allContacts.filter(
    (c) => normalizePhone(c.phone) === cleanCurrentPhone,
  );

  if (matches.length <= 1) {
    return { isNew: true, count: 1 };
  }

  // Sắp xếp các liên hệ trùng số điện thoại theo thời gian tạo tăng dần (cũ nhất lên đầu)
  const sortedMatches = [...matches].sort((a, b) => {
    const diff = new Date(a.created_at) - new Date(b.created_at);
    return diff !== 0 ? diff : a.id - b.id;
  });

  // Tìm vị trí của liên hệ hiện tại trong danh sách đã sắp xếp
  const index = sortedMatches.findIndex((c) => c.id === currentContact.id);

  // Nếu là liên hệ cũ nhất (index === 0), nghĩa là đây là lần đầu tiên họ gửi tin nhắn -> SĐT Mới
  if (index === 0 || index === -1) {
    return { isNew: true, count: 1 };
  } else {
    // Nếu index > 0, nghĩa là họ đã từng liên hệ trước đó -> SĐT Cũ / Khách quay lại
    return { isNew: false, count: index + 1 };
  }
};
