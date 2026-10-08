import supabase from "../lib/supabase";
import { normalizePhone } from "../utils/phoneHelper";

// Định dạng thời gian hiển thị tương tự dữ liệu mẫu
const formatDate = (isoString) => {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (e) {
    return isoString;
  }
};

export const contactService = {
  /**
   * Lấy toàn bộ danh sách liên hệ từ Supabase
   */
  async fetchContacts() {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((item) => ({
      ...item,
      date: formatDate(item.created_at),
      note: item.note || "",
    }));
  },

  /**
   * Gửi tin nhắn thông báo về Telegram khi có liên hệ mới
   */
  async sendTelegramNotification(formData) {
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    // Nếu không cấu hình Token hoặc Chat ID, bỏ qua ngầm không báo lỗi
    if (!botToken || !chatId) {
      console.warn(
        "⚠️ Telegram Bot Token hoặc Chat ID chưa được cấu hình trong file .env!",
      );
      return;
    }

    const adminUrl = "https://nsbenthuyen.com/admin/contacts";
    const phoneStatusText = formData.isNew !== undefined
      ? (formData.isNew ? " 🟢 (Liên hệ lần đầu)" : ` 🔵 (Liên hệ lần ${formData.submissionCount})`)
      : "";

    const messageText = `
<b>🔔 CÓ LIÊN HỆ MỚI - NS BẾN THUYỀN</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Khách hàng:</b> ${formData.name.trim()}
📞 <b>Số điện thoại:</b> ${formData.phone.trim()}${phoneStatusText}
✉️ <b>Email:</b> ${formData.email ? formData.email.trim() : "Không cung cấp"}
💬 <b>Lời nhắn:</b>
<i>${formData.message.trim()}</i>
━━━━━━━━━━━━━━━━━━
🌐 Vui lòng truy cập trang Quản trị hoặc liên hệ ngay để kiểm tra và xử lý.
👉 <a href="${adminUrl}">Vào trang quản trị (nsbenthuyen.com)</a>
    `.trim();

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: "HTML",
        }),
      });
    } catch (err) {
      console.error("❌ Lỗi kết nối gửi thông báo Telegram:", err);
    }
  },

  /**
   * Tạo một yêu cầu liên hệ mới (Dành cho trang khách hàng)
   */
  async createContact(formData) {
    let isNew = true;
    let submissionCount = 1;

    try {
      // Lấy danh sách toàn bộ số điện thoại để so khớp chuẩn hóa
      const { data: existingContacts, error: fetchError } = await supabase
        .from("contact_messages")
        .select("phone");

      if (!fetchError && existingContacts) {
        const cleanInputPhone = normalizePhone(formData.phone);
        const matchesCount = existingContacts.filter(
          (c) => normalizePhone(c.phone) === cleanInputPhone
        ).length;

        isNew = matchesCount === 0;
        submissionCount = matchesCount + 1;
      }
    } catch (err) {
      console.error("⚠️ Lỗi kiểm tra lịch sử số điện thoại:", err);
    }

    const { data, error } = await supabase
      .from("contact_messages")
      .insert([
        {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: (formData.email && formData.email.trim()) || null,
          message: formData.message.trim(),
          status: "pending",
        },
      ])
      .select();

    if (error) throw error;

    // Gửi thông báo ngầm về Telegram
    if (data && data[0]) {
      this.sendTelegramNotification({
        ...formData,
        isNew,
        submissionCount,
      }).catch((err) => {
        console.error("❌ Lỗi gửi Telegram ngầm:", err);
      });
    }

    return data ? data[0] : null;
  },

  /**
   * Cập nhật trạng thái xử lý của liên hệ
   */
  async updateContactStatus(id, newStatus) {
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ status: newStatus })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data ? data[0] : null;
  },

  /**
   * Cập nhật ghi chú nội bộ của liên hệ
   */
  async updateContactNote(id, noteVal) {
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ note: noteVal })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data ? data[0] : null;
  },
};

export default contactService;
