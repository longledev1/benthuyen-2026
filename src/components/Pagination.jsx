import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * Component Phân trang tái sử dụng mang phong cách của NS Bến Thuyền
 * @param {number} currentPage - Trang hiện tại (1-indexed)
 * @param {number} totalPages - Tổng số trang
 * @param {function} onPageChange - Callback khi chuyển trang, nhận vào số trang mới
 */
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Nếu chỉ có 1 trang hoặc không có trang nào, không cần hiển thị phân trang
  if (totalPages <= 1) return null;

  // Thuật toán lấy danh sách số trang hiển thị (giới hạn 5 trang xung quanh trang hiện tại)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-1.5 py-6 font-sans text-xs select-none">
      {/* Nút Trước (Prev) */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="hover:border-primary hover:text-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all disabled:pointer-events-none disabled:opacity-40"
        title="Trang trước"
      >
        <FiChevronLeft size={16} />
      </button>

      {/* Trang đầu và dấu ba chấm nếu cần */}
      {pages[0] > 1 && (
        <>
          <button
            type="button"
            onClick={() => onPageChange(1)}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border text-xs font-semibold transition-all ${
              currentPage === 1
                ? "border-primary bg-primary text-white"
                : "hover:border-primary hover:text-primary border-slate-200 bg-white text-slate-600"
            }`}
          >
            1
          </button>
          {pages[0] > 2 && (
            <span className="px-1 font-medium text-slate-400 select-none">
              ...
            </span>
          )}
        </>
      )}

      {/* Danh sách trang ở giữa */}
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border text-xs font-semibold transition-all ${
            currentPage === p
              ? "border-primary bg-primary text-white shadow-sm"
              : "hover:border-primary hover:text-primary border-slate-200 bg-white text-slate-600"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Trang cuối và dấu ba chấm nếu cần */}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1 font-medium text-slate-400 select-none">
              ...
            </span>
          )}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border text-xs font-semibold transition-all ${
              currentPage === totalPages
                ? "border-primary bg-primary text-white"
                : "hover:border-primary hover:text-primary border-slate-200 bg-white text-slate-600"
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Nút Sau (Next) */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="hover:border-primary hover:text-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all disabled:pointer-events-none disabled:opacity-40"
        title="Trang sau"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
