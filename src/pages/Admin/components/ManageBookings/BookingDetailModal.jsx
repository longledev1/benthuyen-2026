import React from "react";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { RiVipCrownLine } from "react-icons/ri";

export const BookingDetailModal = ({ selectedBooking, setSelectedBooking }) => {
  if (!selectedBooking) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedBooking(null)}
        className="bg-primary/60 fixed inset-0 cursor-pointer backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-[101] max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-black/5 bg-white text-slate-800 shadow-2xl"
      >
        <div className="bg-secondary h-[4px] w-full" />

        <div className="p-6 sm:p-8">
          <button
            onClick={() => setSelectedBooking(null)}
            className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
          >
            <FiX size={18} />
          </button>

          <span className="text-secondary mb-1 block text-[10px] font-semibold tracking-[0.25em] uppercase">
            Chi Tiết Yêu Cầu Đặt Bàn
          </span>
          <h3 className="text-primary mb-6 font-sans text-xl font-bold sm:text-2xl">
            Thông tin bàn đặt
          </h3>

          <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-5 text-sm sm:grid-cols-2">
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">
                Khách hàng
              </span>
              <span className="block text-base font-bold text-slate-800">
                {selectedBooking.name}
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">
                Thời gian đặt
              </span>
              <span className="block font-sans text-sm font-medium text-slate-600">
                {selectedBooking.date}
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">
                Số điện thoại
              </span>
              <a
                href={`tel:${selectedBooking.phone}`}
                className="text-primary block font-sans text-sm font-bold hover:underline"
              >
                {selectedBooking.phone}
              </a>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">
                Khung giờ đến
              </span>
              <span className="block w-max rounded bg-slate-200/50 px-2 py-0.5 font-sans text-sm font-bold text-slate-700">
                {selectedBooking.time_slot}
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">
                Số lượng khách
              </span>
              <span className="block font-sans text-sm font-bold text-slate-700">
                {selectedBooking.guest_count} người
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">
                Khu vực ăn uống
              </span>
              {selectedBooking.area === "Phòng VIP" ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-200/50 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                  <RiVipCrownLine size={11} className="text-blue-600" />
                  <span>{selectedBooking.vip_room_name || "Phòng VIP"}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/50 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                  <MdOutlineTableRestaurant
                    size={11}
                    className="text-slate-500"
                  />
                  <span>Sảnh chung</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-6">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Trạng thái:
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  selectedBooking.status === "completed"
                    ? "border border-emerald-100 bg-emerald-50 text-emerald-600"
                    : "border border-amber-100 bg-amber-50 text-amber-600"
                }`}
              >
                {selectedBooking.status === "completed"
                  ? "Đã xử lý"
                  : "Chưa xử lý"}
              </span>
            </div>
            <button
              onClick={() => setSelectedBooking(null)}
              className="bg-primary hover:bg-primary/90 cursor-pointer rounded-lg px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingDetailModal;
