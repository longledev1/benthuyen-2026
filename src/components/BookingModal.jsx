import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiUser,
  FiPhone,
  FiCalendar,
  FiUsers,
  FiCheck,
} from "react-icons/fi";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { RiVipCrownLine } from "react-icons/ri";
import { bookingService } from "../services/bookingService";
import { CustomSelect } from "./Form/CustomSelect";

// 6 Phòng VIP phong cách biển cả sang trọng
const VIP_ROOMS = [
  {
    id: "haiau",
    name: "Phòng VIP Hải Âu",
    desc: "Không gian biển khơi lộng gió, view sông tuyệt mỹ, sức chứa 6-12 khách.",
    image: "/images/vip/haiau.jpg",
  },
  {
    id: "saobien",
    name: "Phòng VIP Sao Biển",
    desc: "Cảm hứng từ rặng sao biển ấm cúng, lung linh lãng mạn, sức chứa 4-8 khách.",
    image: "/images/vip/saobien.jpg",
  },
  {
    id: "sanho",
    name: "Phòng VIP San Hô",
    desc: "Sắc màu huyền ảo của rặng san hô tự nhiên, sức chứa 8-16 khách.",
    image: "/images/vip/sanho.jpg",
  },
  {
    id: "ngoctrai",
    name: "Phòng VIP Ngọc Trai",
    desc: "Tông màu ngọc trai sang trọng, quý phái đẳng cấp, sức chứa 6-10 khách.",
    image: "/images/vip/ngoctrai.jpg",
  },
  {
    id: "ocbien",
    name: "Phòng VIP Ốc Biển",
    desc: "Mô phỏng đường xoắn ốc sâu thẳm độc đáo, ấm cúng, sức chứa 4-8 khách.",
    image: "/images/vip/ocbien.jpg",
  },
  {
    id: "trungduong",
    name: "Phòng VIP Trùng Dương",
    desc: "Không gian đại tiệc đại dương rộng lớn, trang trọng, sức chứa 15-30 khách.",
    image: "/images/vip/trungduong.jpg",
  },
];

// Khung giờ hoạt động từ 10:00 sáng đến 22:00 tối
const TIME_SLOTS = [
  { value: "10:00", label: "10:00 Sáng" },
  { value: "11:00", label: "11:00 Trưa" },
  { value: "12:00", label: "12:00 Trưa" },
  { value: "13:00", label: "13:00 Trưa" },
  { value: "14:00", label: "14:00 Chiều" },
  { value: "15:00", label: "15:00 Chiều" },
  { value: "16:00", label: "16:00 Chiều" },
  { value: "17:00", label: "17:00 Chiều" },
  { value: "18:00", label: "18:00 Tối" },
  { value: "19:00", label: "19:00 Tối" },
  { value: "20:00", label: "20:00 Tối" },
  { value: "21:00", label: "21:00 Tối" },
  { value: "22:00", label: "22:00 Tối" },
];

export const BookingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    time_slot: "18:00",
    guest_count: "4",
    area: "Sảnh chung", // Sảnh chung hoặc Phòng VIP
    vip_room_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAreaChange = (selectedArea) => {
    setFormData((prev) => ({
      ...prev,
      area: selectedArea,
      // Reset tên phòng VIP nếu đổi về sảnh chung
      vip_room_name: selectedArea === "Sảnh chung" ? "" : prev.vip_room_name,
    }));
  };

  const handleVipRoomSelect = (roomName) => {
    setFormData((prev) => ({
      ...prev,
      vip_room_name: roomName,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra nhanh các trường bắt buộc
    if (!formData.name.trim()) {
      setError("Vui lòng nhập họ và tên của Quý khách.");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Vui lòng nhập số điện thoại liên hệ.");
      return;
    }
    if (formData.area === "Phòng VIP" && !formData.vip_room_name) {
      setError("Vui lòng chọn 1 Phòng VIP trong danh sách.");
      return;
    }

    setLoading(true);

    try {
      await bookingService.createBooking(formData);

      setSuccess(true);
      setFormData({
        name: "",
        phone: "",
        time_slot: "18:00",
        guest_count: "4",
        area: "Sảnh chung",
        vip_room_name: "",
      });
    } catch (err) {
      console.error("⚠️ Lỗi gửi thông tin đặt bàn:", err);
      setError("Có lỗi xảy ra khi gửi yêu cầu đặt bàn. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="bg-primary/60 fixed inset-0 cursor-pointer backdrop-blur-md"
          />

          {/* Form Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="thin-scrollbar relative z-[101] max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-2xl border border-black/5 bg-white text-slate-800 shadow-2xl"
          >
            {/* Top decorative gold line */}
            <div className="via-secondary h-[4px] w-full bg-gradient-to-r from-transparent to-transparent" />

            {/* Header Area */}
            <div className="relative p-6 pb-2 text-center">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
                aria-label="Đóng"
              >
                <FiX size={18} />
              </button>

              <span className="text-secondary text-[11px] font-bold tracking-[0.25em] uppercase">
                Đặt Bàn Trực Tuyến
              </span>
              <h3 className="text-primary mt-1 mb-1.5 text-2xl font-bold tracking-wide">
                Trải nghiệm Ẩm thực Bến Thuyền
              </h3>
              <p className="mx-auto max-w-md font-sans text-xs leading-relaxed text-slate-500">
                Quý khách vui lòng điền thông tin đặt bàn dưới đây. Nhà hàng
                luôn sẵn sàng phục vụ Quý khách chu đáo nhất.
              </p>
            </div>

            {/* Form & Success States */}
            <div className="px-6 pb-6">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h4 className="text-primary mb-2 text-xl font-bold">
                    Đặt bàn thành công!
                  </h4>
                  <p className="max-w-sm font-sans text-xs leading-relaxed text-slate-500">
                    Cảm ơn quý khách đã tin tưởng lựa chọn nhà hàng. Thông tin
                    của quý khách đã được ghi nhận và nhà hàng sẽ liên hệ xác
                    nhận trong giây lát.
                  </p>
                  <button
                    onClick={handleClose}
                    className="bg-primary hover:bg-primary/90 mt-6 cursor-pointer rounded-lg px-8 py-3 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-md transition-all duration-300"
                  >
                    Đóng cửa sổ
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600"
                    >
                      ⚠️ {error}
                    </motion.div>
                  )}

                  {/* Input Name */}
                  <div>
                    <label
                      htmlFor="booking-name"
                      className="text-primary mb-1.5 block text-xs font-bold tracking-wider uppercase"
                    >
                      Họ và tên Anh/Chị <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <FiUser size={15} />
                      </span>
                      <input
                        id="booking-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        className="focus:border-primary focus:ring-primary w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-1 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Row: Phone & Time & Guest Count */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Input Phone */}
                    <div>
                      <label
                        htmlFor="booking-phone"
                        className="text-primary mb-1.5 block text-xs font-bold tracking-wider uppercase"
                      >
                        Số điện thoại <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <FiPhone size={15} />
                        </span>
                        <input
                          id="booking-phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0901234567"
                          className="focus:border-primary focus:ring-primary w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-1 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Time Slot (Dropdown) */}
                    <div>
                      <label
                        htmlFor="booking-time"
                        className="text-primary mb-1.5 block text-xs font-bold tracking-wider uppercase"
                      >
                        Khung giờ đến <span className="text-rose-500">*</span>
                      </label>
                      <CustomSelect
                        value={formData.time_slot}
                        onChange={(val) =>
                          setFormData((prev) => ({ ...prev, time_slot: val }))
                        }
                        options={TIME_SLOTS}
                        className="w-full"
                        buttonClassName="py-[10.5px] border-slate-300 bg-slate-50 text-slate-800 text-sm font-medium"
                      />
                    </div>

                    {/* Guest Count */}
                    <div>
                      <label
                        htmlFor="booking-guests"
                        className="text-primary mb-1.5 block text-xs font-bold tracking-wider uppercase"
                      >
                        Số lượng khách <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <FiUsers size={15} />
                        </span>
                        <input
                          id="booking-guests"
                          type="number"
                          name="guest_count"
                          value={formData.guest_count}
                          onChange={handleChange}
                          min="1"
                          placeholder="4"
                          className="focus:border-primary focus:ring-primary w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-1 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Area Selector (Sảnh chung vs Phòng VIP) */}
                  <div>
                    <label className="text-primary mb-1.5 block text-xs font-bold tracking-wider uppercase">
                      Khu vực ăn uống <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => handleAreaChange("Sảnh chung")}
                        className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold transition-all ${
                          formData.area === "Sảnh chung"
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <MdOutlineTableRestaurant size={18} />
                        <span>Sảnh chung</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAreaChange("Phòng VIP")}
                        className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold transition-all ${
                          formData.area === "Phòng VIP"
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <RiVipCrownLine size={18} />
                        <span>Phòng VIP</span>
                      </button>
                    </div>
                  </div>

                  {/* VIP Rooms Grid - Show only when Area is Phòng VIP */}
                  <AnimatePresence>
                    {formData.area === "Phòng VIP" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 border-t border-slate-100 pt-3">
                          <label className="text-secondary mb-2 block text-xs font-bold tracking-wider uppercase">
                            Danh sách Phòng VIP ẩm thực
                          </label>
                          <div className="thin-scrollbar grid max-h-[300px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
                            {VIP_ROOMS.map((room) => {
                              const isSelected =
                                formData.vip_room_name === room.name;
                              return (
                                <div
                                  key={room.id}
                                  onClick={() => handleVipRoomSelect(room.name)}
                                  className={`group relative cursor-pointer overflow-hidden rounded-xl border transition-all ${
                                    isSelected
                                      ? "border-secondary bg-secondary/5 ring-secondary ring-1"
                                      : "border-slate-200 bg-white hover:border-slate-400"
                                  }`}
                                >
                                  {/* Room image placeholder/actual */}
                                  <div className="relative h-16 w-full overflow-hidden bg-slate-100 sm:h-20">
                                    <img
                                      src={room.image}
                                      alt={room.name}
                                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                      onError={(e) => {
                                        // Fallback if image fails to load
                                        e.target.src =
                                          "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80";
                                      }}
                                    />
                                    {isSelected && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <div className="bg-secondary rounded-full p-1 text-white">
                                          <FiCheck size={14} />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-2 text-left">
                                    <h5 className="truncate text-xs font-bold text-slate-800">
                                      {room.name}
                                    </h5>
                                    <p className="mt-0.5 line-clamp-2 font-sans text-[10px] leading-tight text-slate-400">
                                      {room.desc}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-lg py-3.5 text-xs font-bold tracking-[0.25em] text-white uppercase shadow-lg transition-all active:scale-98 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="mr-3 -ml-1 h-4 w-4 animate-spin text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Đang xử lý đặt bàn...</span>
                      </>
                    ) : (
                      <span>Xác nhận gửi thông tin đặt bàn</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
