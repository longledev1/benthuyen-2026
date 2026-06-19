import React, { useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiInfo,
  FiX,
  FiPhone,
  FiCalendar,
  FiMessageSquare,
  FiUsers,
  FiMapPin,
  FiChevronDown,
  FiClock,
} from "react-icons/fi";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { RiVipCrownLine } from "react-icons/ri";
import { FilterTabs, SearchInput, CustomSelect } from "../../components/Form";
import Pagination from "../../components/Pagination";
import { normalizePhone } from "../../utils/phoneHelper";
import { useDebounce } from "../../utils/useDebounce";
import { removeTones } from "../../utils/stringHelper";

export const ManageBookings = () => {
  const { bookings, handleToggleBookingStatus, handleUpdateBookingNote } =
    useOutletContext();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [areaFilter, setAreaFilter] = useState("all"); // all, sanh, vip

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const bookingsPerPage = 10;

  // Reset trang về 1 khi thay đổi tab lọc
  const handleFilterChange = (newTab) => {
    setBookingStatusFilter(newTab);
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page: 1 });
  };

  // Reset trang về 1 khi gõ tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page: 1 });
  };

  // Reset trang về 1 khi xóa ô tìm kiếm
  const handleSearchClear = () => {
    setSearchQuery("");
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page: 1 });
  };

  // Lọc cơ sở theo từ khóa tìm kiếm và khu vực
  const baseFilteredBookings = bookings
    .filter((b) => {
      if (areaFilter === "all") return true;
      if (areaFilter === "sanh") return b.area === "Sảnh chung";
      if (areaFilter === "vip") return b.area === "Phòng VIP";
      return true;
    })
    .filter((b) => {
      const query = debouncedSearchQuery.trim();
      if (query === "") return true;

      // Chuẩn hóa tìm kiếm không dấu
      const cleanQuery = removeTones(query);

      // So khớp tên không dấu
      const cleanName = removeTones(b.name);
      if (cleanName.includes(cleanQuery)) return true;

      // So khớp số điện thoại
      const cleanPhone = normalizePhone(b.phone);
      const cleanQueryPhone = normalizePhone(cleanQuery);
      if (cleanQueryPhone && cleanPhone.includes(cleanQueryPhone)) return true;
      if (b.phone.includes(query)) return true;

      // So khớp tên phòng VIP
      if (
        b.vip_room_name &&
        removeTones(b.vip_room_name).includes(cleanQuery)
      ) {
        return true;
      }

      // So khớp khu vực
      const cleanArea = removeTones(b.area);
      if (cleanArea.includes(cleanQuery)) return true;

      return false;
    });

  // Lọc theo Tab trạng thái xử lý để ra danh sách cuối cùng hiển thị và phân trang
  const filteredBookings = baseFilteredBookings.filter(
    (b) => bookingStatusFilter === "all" || b.status === bookingStatusFilter,
  );

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + bookingsPerPage,
  );

  return (
    <div className="space-y-6">
      {/* Lọc và Tìm kiếm đặt bàn */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
        <FilterTabs
          tabs={[
            {
              value: "all",
              label: "Tất cả đặt bàn",
              count: baseFilteredBookings.length,
            },
            {
              value: "pending",
              label: "Chưa xử lý",
              count: baseFilteredBookings.filter((b) => b.status === "pending")
                .length,
            },
            {
              value: "completed",
              label: "Đã xử lý",
              count: baseFilteredBookings.filter(
                (b) => b.status === "completed",
              ).length,
            },
          ]}
          activeTab={bookingStatusFilter}
          onTabChange={handleFilterChange}
        />

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {/* Dropdown Lọc Khu Vực */}
          <CustomSelect
            value={areaFilter}
            onChange={(val) => {
              setAreaFilter(val);
              const params = Object.fromEntries(searchParams.entries());
              setSearchParams({ ...params, page: 1 });
            }}
            options={[
              {
                value: "all",
                label: (
                  <span className="flex min-w-0 items-center gap-1.5">
                    <FiMapPin
                      size={12}
                      className="text-secondary flex-shrink-0"
                    />
                    <span className="truncate">Tất cả khu vực</span>
                  </span>
                ),
              },
              {
                value: "sanh",
                label: (
                  <span className="flex min-w-0 items-center gap-1.5">
                    <MdOutlineTableRestaurant
                      size={12}
                      className="flex-shrink-0 text-slate-500"
                    />
                    <span className="truncate">Sảnh chung</span>
                  </span>
                ),
              },
              {
                value: "vip",
                label: (
                  <span className="flex min-w-0 items-center gap-1.5">
                    <RiVipCrownLine
                      size={12}
                      className="text-secondary flex-shrink-0"
                    />
                    <span className="truncate">Phòng VIP</span>
                  </span>
                ),
              },
            ]}
            className="w-full min-w-[170px] sm:w-auto"
            buttonClassName="w-full"
          />

          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            placeholder="Tìm tên, SĐT, phòng VIP..."
          />

          {/* Nút Reset bộ lọc (chỉ hiện khi có bộ lọc hoạt động) */}
          {(searchQuery !== "" ||
            areaFilter !== "all" ||
            bookingStatusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setAreaFilter("all");
                setBookingStatusFilter("all");
                setSearchParams({ page: 1 });
              }}
              className="flex cursor-pointer items-center justify-center space-x-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold whitespace-nowrap text-rose-600 shadow-sm transition-all hover:bg-rose-100/70"
            >
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* BẢNG DANH SÁCH ĐẶT BÀN (Chỉ hiển thị trên màn hình lớn Desktop) */}
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
                <th className="rounded-tr-2xl px-6 py-4 text-right">
                  Chi tiết
                </th>
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
                    className={`transition-colors hover:bg-slate-50/50 ${index === paginatedBookings.length - 1 ? "[&>td:first-child]:rounded-bl-2xl [&>td:last-child]:rounded-br-2xl" : ""}`}
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

      {/* DANH SÁCH DẠNG CARD (Hiển thị trên Mobile & Tablet/iPad) */}
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
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70"
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

      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          const params = Object.fromEntries(searchParams.entries());
          setSearchParams({ ...params, page });
        }}
      />

      {/* POPUP CHI TIẾT ĐẶT BÀN */}
      <AnimatePresence>
        {selectedBooking && (
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
                        <span>
                          {selectedBooking.vip_room_name || "Phòng VIP"}
                        </span>
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageBookings;
