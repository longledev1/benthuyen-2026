import React from "react";
import { FiInfo, FiCalendar, FiUsers, FiClock } from "react-icons/fi";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { RiVipCrownLine } from "react-icons/ri";
import { CustomSelect } from "../../../../components/Form";

export const BookingTable = ({
  paginatedBookings,
  setSelectedBooking,
  handleToggleBookingStatus,
  handleUpdateBookingNote,
}) => {
  return (
    <div className="hidden rounded-2xl border border-black/5 bg-white shadow-sm xl:block">
      <div className="w-full">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 font-sans text-[10px] tracking-widest text-slate-500 uppercase">
              <th className="rounded-tl-2xl px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Số điện thoại</th>
              <th className="px-6 py-4">Thông tin đặt bàn</th>
              <th className="px-6 py-4">Khu vực</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="min-w-[200px] px-6 py-4">Ghi chú nội bộ</th>
              <th className="rounded-tr-2xl px-6 py-4 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
            {paginatedBookings.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="rounded-b-2xl py-16 text-center text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FiCalendar className="text-slate-300" size={40} />
                    <p className="text-sm font-semibold text-slate-400">
                      Không tìm thấy đơn đặt bàn nào.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedBookings.map((b, index) => (
                <tr
                  key={b.id}
                  className={`transition-colors hover:bg-slate-50/50 ${
                    index === paginatedBookings.length - 1
                      ? "[&>td:first-child]:rounded-bl-2xl [&>td:last-child]:rounded-br-2xl"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-slate-800">
                      {b.name}
                    </p>
                    <span className="font-sans text-xs text-slate-400">
                      {b.date}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-sans text-sm font-semibold whitespace-nowrap text-slate-800">
                    {b.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                          <FiClock size={12} className="text-slate-500" />
                          <span>{b.time_slot}</span>
                        </span>
                        <span className="text-secondary bg-secondary/5 border-secondary/20 inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-bold">
                          <FiUsers size={12} className="text-secondary" />
                          <span>{b.guest_count} khách</span>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {b.area === "Phòng VIP" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-200/50 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                        <RiVipCrownLine size={11} className="text-blue-600" />
                        <span>{b.vip_room_name || "Phòng VIP"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/50 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        <MdOutlineTableRestaurant
                          size={11}
                          className="text-slate-500"
                        />
                        <span>Sảnh chung</span>
                      </span>
                    )}
                  </td>
                  <td className="min-w-[160px] px-6 py-4 whitespace-nowrap">
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
                          ? "border border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/75"
                          : "border-amber-250 bg-amber-50 text-amber-700 hover:bg-amber-100/75"
                      }`}
                      className="w-full"
                      placement={
                        paginatedBookings.length > 3 &&
                        index >= paginatedBookings.length - 2
                          ? "top"
                          : "bottom"
                      }
                    />
                  </td>
                  <td className="min-w-[200px] px-6 py-4">
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
                      className="focus:border-primary w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs placeholder-slate-400 focus:bg-white focus:outline-none"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="hover:bg-primary ml-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-all hover:text-white"
                      title="Xem chi tiết"
                    >
                      <FiInfo size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
