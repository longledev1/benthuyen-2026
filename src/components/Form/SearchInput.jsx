import React, { forwardRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";

/**
 * SearchInput Component - Ô tìm kiếm chuyên dụng cho Dashboard
 * Hỗ trợ nút xóa nhanh từ khóa khi có chữ
 */
export const SearchInput = forwardRef(
  (
    {
      value,
      onChange,
      onClear,
      placeholder = "Tìm kiếm...",
      className = "",
      containerClassName = "",
      ...props
    },
    ref,
  ) => {
    const showClearButton = value && value.length > 0;

    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        // Giả lập sự kiện change với value trống để react-hook-form hoặc state cập nhật
        onChange({ target: { value: "" } });
      }
    };

    return (
      <div className={`relative w-full max-w-xs ${containerClassName}`}>
        {/* Icon kính lúp ở đầu ô */}
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <FiSearch size={16} />
        </span>

        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`border-slate-350 focus:border-primary focus:ring-primary w-full rounded-lg border bg-white py-2 pr-9 pl-9 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:ring-1 focus:outline-none ${className}`}
          {...props}
        />

        {/* Nút xóa nhanh từ khóa (X) ở cuối ô */}
        {showClearButton && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-slate-400 hover:text-slate-700"
            aria-label="Xóa từ khóa"
          >
            <FiX size={16} />
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
