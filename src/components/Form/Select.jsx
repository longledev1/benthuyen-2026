import React, { forwardRef } from "react";
import CustomSelect from "./CustomSelect";

/**
 * Select Component hỗ trợ forwardRef và sử dụng CustomSelect
 * để hiển thị giao diện dropdown đẹp, mượt mà thay cho native select.
 * Tương thích hoàn toàn với các hook form và sự kiện controlled (e.target.value).
 */
export const Select = forwardRef(
  (
    {
      label,
      error,
      options = [],
      placeholder,
      required = false,
      icon: Icon,
      className = "",
      containerClassName = "",
      value,
      onChange,
      disabled = false,
      name,
      ...props
    },
    ref,
  ) => {
    // Giả lập event object để giữ tính tương thích với onChange nguyên bản (e.target.value)
    const handleSelectChange = (val) => {
      if (onChange) {
        onChange({
          target: {
            name: name,
            value: val,
          },
        });
      }
    };

    return (
      <div className={`flex w-full flex-col space-y-1.5 ${containerClassName}`}>
        {label && (
          <label className="text-primary flex items-center text-xs font-semibold tracking-wide uppercase">
            {label}
            {required && <span className="ml-1 text-rose-500">*</span>}
          </label>
        )}

        <div className="relative w-full">
          {Icon && (
            <span className="absolute inset-y-0 left-0 z-10 flex items-center pl-3.5 text-slate-400 pointer-events-none">
              <Icon size={16} />
            </span>
          )}

          {/* Input ẩn để giữ tương thích ref và form submit */}
          <input
            type="hidden"
            name={name}
            value={value || ""}
            ref={ref}
            readOnly
            {...props}
          />

          <CustomSelect
            value={value}
            onChange={handleSelectChange}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full"
            customButton={true}
            buttonClassName={`w-full text-left font-medium text-slate-800 bg-slate-50 border py-2.5 rounded-lg text-sm transition-all focus:bg-white focus:ring-1 focus:outline-none ${
              Icon ? "pl-10 pr-10" : "pl-4 pr-10"
            } ${
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
                : "focus:border-primary focus:ring-primary border-slate-300"
            } ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"} ${className}`}
            menuClassName="w-full left-0 right-0"
          />
        </div>

        {error && (
          <span className="animate-fadeIn text-xs font-medium text-rose-600">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
