import React from "react";
import { FiInfo, FiCalendar, FiUsers, FiPhone, FiMapPin } from "react-icons/fi";
import { CustomSelect } from "../../../../components/Form";

export const BookingCards = ({
  paginatedBookings,
  setSelectedBooking,
  handleToggleBookingStatus,
  handleUpdateBookingNote,
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:hidden">
      {paginatedBookings.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-black/5 bg-white py-16 text-center shadow-sm">
          <FiCalendar className="text-slate-350 mb-3" size={40} />
          <p className="text-sm font-medium text-slate-400">
            Không tìm thấy đơn đặt bàn nào.
          </p>
        </div>
      ) : (
        paginatedBookings.map((b) => (
          <div
            key={b.id}
            className={`flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
              b.status === "completed"
                ? "border-slate-100"
                : "border-amber-100"
            }`}
          >
            {/* Card Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="bg-primary/5 text-primary flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-base font-bold">
                  {b.name ? b.name.trim().charAt(0).toUpperCase() : "?"}
                </div>
                <div>
                  <h4 className="text-base leading-snug font-bold text-slate-800">
                    {b.name}
                  </h4>
                  <span className="mt-0.5 block font-sans text-xs text-slate-400">
                    {b.date}
                  </span>
                </div>
              </div>

              {/* Dropdown Trạng thái */}
              <CustomSelect
                value={b.status}
                onChange={(val) => handleToggleBookingStatus(b.id, val)}
                options={[
                  { value: "pending", label: "🟡 Chưa xử lý" },
                  { value: "completed", label: "🟢 Đã xử lý" },
                ]}
                customButton={true}
                buttonClassName={`w-full rounded-full pl-3 pr-8 py-1.5 text-xs font-bold cursor-pointer transition-all ${
                  b.status === "completed"
                    ? "border border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70"
                    : "border-amber-250 bg-amber-50 text-amber-700 hover:bg-amber-100/70"
                }`}
                className="w-[145px]"
              />
            </div>

            {/* Card Body */}
            <div className="flex-1 space-y-3.5 py-4 text-slate-600">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Số điện thoại */}
                <div className="flex flex-col rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                  <span className="mb-1 text-[9px] font-bold text-slate-400 uppercase">
                    Điện thoại:
                  </span>
                  <a
                    href={`tel:${b.phone}`}
                    className="flex items-center space-x-1.5 font-sans text-sm font-bold text-[#3c6881] hover:underline"
                  >
                    <FiPhone size={12} className="text-secondary" />
                    <span className="truncate">{b.phone}</span>
                  </a>
                </div>

                {/* Thời gian */}
                <div className="flex flex-col rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                  <span className="mb-1 text-[9px] font-bold text-slate-400 uppercase">
                    Khung giờ:
                  </span>
                  <span className="flex items-center space-x-1.5 font-sans text-sm font-bold text-slate-700">
                    <FiCalendar size={12} className="text-secondary" />
                    <span>{b.time_slot}</span>
                  </span>
                </div>
              </div>

              {/* Sức chứa và khu vực */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                  <span className="mb-1 text-[9px] font-bold text-slate-400 uppercase">
                    Số lượng khách:
                  </span>
                  <span className="flex items-center space-x-1.5 text-sm font-bold text-slate-700">
                    <FiUsers size={12} className="text-secondary" />
                    <span>{b.guest_count} khách</span>
                  </span>
                </div>

                <div className="flex flex-col rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                  <span className="mb-1 text-[9px] font-bold text-slate-400 uppercase">
                    Khu vực:
                  </span>
                  <span className="flex items-center space-x-1.5 text-sm font-bold text-slate-700">
                    <FiMapPin size={12} className="text-secondary" />
                    <span className="truncate">
                      {b.area === "Phòng VIP"
                        ? b.vip_room_name || "Phòng VIP"
                        : "Sảnh chung"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
              <div className="flex-1 space-y-1">
                <span className="block text-[9px] font-bold text-slate-400 uppercase">
                  Ghi chú nội bộ:
                </span>
                <input
                  type="text"
                  defaultValue={b.note || ""}
                  onBlur={(e) => {
                    if (e.target.value !== (b.note || "")) {
                      handleUpdateBookingNote(b.id, e.target.value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.target.blur();
                    }
                  }}
                  placeholder="Nhập ghi chú nhanh..."
                  className="focus:border-primary w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs placeholder-slate-400 transition-colors focus:bg-white focus:outline-none"
                />
              </div>
              <button
                onClick={() => setSelectedBooking(b)}
                className="hover:bg-primary flex h-8 w-8 cursor-pointer items-center justify-center self-end rounded-lg bg-slate-50 text-slate-500 transition-all hover:text-white"
                title="Xem chi tiết"
              >
                <FiInfo size={14} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BookingCards;
