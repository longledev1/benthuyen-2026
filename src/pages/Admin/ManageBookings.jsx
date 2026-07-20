import React, { useState, useMemo } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { FiMapPin } from "react-icons/fi";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { RiVipCrownLine } from "react-icons/ri";
import { FilterTabs, SearchInput, CustomSelect } from "../../components/Form";
import Pagination from "../../components/Pagination";
import { normalizePhone } from "../../utils/phoneHelper";
import { useDebounce } from "../../utils/useDebounce";
import { removeTones } from "../../utils/stringHelper";

// Sub-components
import BookingTable from "./components/ManageBookings/BookingTable";
import BookingCards from "./components/ManageBookings/BookingCards";
import BookingDetailModal from "./components/ManageBookings/BookingDetailModal";

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
  const baseFilteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        if (areaFilter === "all") return true;
        if (areaFilter === "sanh") return b.area === "Sảnh chung";
        if (areaFilter === "vip") return b.area === "Phòng VIP";
        return true;
      })
      .filter((b) => {
        const queryVal = debouncedSearchQuery.trim();
        if (queryVal === "") return true;

        // Chuẩn hóa tìm kiếm không dấu
        const cleanQuery = removeTones(queryVal);

        // So khớp tên không dấu
        const cleanName = removeTones(b.name);
        if (cleanName.includes(cleanQuery)) return true;

        // So khớp số điện thoại
        const cleanPhone = normalizePhone(b.phone);
        const cleanQueryPhone = normalizePhone(cleanQuery);
        if (cleanQueryPhone && cleanPhone.includes(cleanQueryPhone)) return true;
        if (b.phone.includes(queryVal)) return true;

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
  }, [bookings, areaFilter, debouncedSearchQuery]);

  // Lọc theo Tab trạng thái xử lý để ra danh sách cuối cùng hiển thị và phân trang
  const filteredBookings = useMemo(() => {
    return baseFilteredBookings.filter(
      (b) => bookingStatusFilter === "all" || b.status === bookingStatusFilter,
    );
  }, [baseFilteredBookings, bookingStatusFilter]);

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
      <BookingTable
        paginatedBookings={paginatedBookings}
        setSelectedBooking={setSelectedBooking}
        handleToggleBookingStatus={handleToggleBookingStatus}
        handleUpdateBookingNote={handleUpdateBookingNote}
      />

      {/* DANH SÁCH DẠNG CARD (Hiển thị trên Mobile & Tablet/iPad) */}
      <BookingCards
        paginatedBookings={paginatedBookings}
        setSelectedBooking={setSelectedBooking}
        handleToggleBookingStatus={handleToggleBookingStatus}
        handleUpdateBookingNote={handleUpdateBookingNote}
      />

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
          <BookingDetailModal
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageBookings;
