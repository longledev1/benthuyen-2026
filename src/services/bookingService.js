import supabase from "../lib/supabase";

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

export const bookingService = {
  /**
   * Lấy toàn bộ danh sách đặt bàn từ Supabase
   */
  async fetchBookings() {
    const { data, error } = await supabase
      .from("table_bookings")
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
   * Gửi tin nhắn thông báo về Telegram khi có đặt bàn mới
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

    const adminUrl = "https://nsbenthuyen.com/admin/bookings";
    const areaText = formData.area === "Phòng VIP" 
      ? `👑 Phòng VIP (${formData.vip_room_name})` 
      : "🍽️ Sảnh chung";

    const messageText = `
<b>🔔 CÓ ĐẶT BÀN MỚI - NS BẾN THUYỀN</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Khách hàng:</b> ${formData.name.trim()}
📞 <b>Số điện thoại:</b> ${formData.phone.trim()}
🕒 <b>Khung giờ:</b> ${formData.time_slot}
👥 <b>Số lượng khách:</b> ${formData.guest_count} người
📍 <b>Khu vực:</b> ${areaText}
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
      console.error("❌ Lỗi kết nối gửi thông báo Telegram đặt bàn:", err);
    }
  },

  /**
   * Tạo một yêu cầu đặt bàn mới (Dành cho trang khách hàng)
   */
  async createBooking(formData) {
    const { data, error } = await supabase
      .from("table_bookings")
      .insert([
        {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          time_slot: formData.time_slot,
          guest_count: parseInt(formData.guest_count, 10) || 1,
          area: formData.area,
          vip_room_name: formData.area === "Phòng VIP" ? formData.vip_room_name : null,
          status: "pending",
          note: "",
        },
      ])
      .select();

    if (error) throw error;

    // Gửi thông báo ngầm về Telegram
    if (data && data[0]) {
      this.sendTelegramNotification(data[0]).catch((err) => {
        console.error("❌ Lỗi gửi Telegram ngầm:", err);
      });
    }

    return data ? data[0] : null;
  },

  /**
   * Cập nhật trạng thái xử lý của đặt bàn
   */
  async updateBookingStatus(id, newStatus) {
    const { data, error } = await supabase
      .from("table_bookings")
      .update({ status: newStatus })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data ? data[0] : null;
  },

  /**
   * Cập nhật ghi chú nội bộ của đặt bàn
   */
  async updateBookingNote(id, noteVal) {
    const { data, error } = await supabase
      .from("table_bookings")
      .update({ note: noteVal })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data ? data[0] : null;
  },
};

export default bookingService;
