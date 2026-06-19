import React, { forwardRef } from "react";

/**
 * Checkbox Component hỗ trợ forwardRef để tích hợp mượt mà với react-hook-form register
 */
export const Checkbox = forwardRef(
  (
    {
      label,
      error,
      required = false,
      className = "",
      containerClassName = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`flex flex-col space-y-1 ${containerClassName}`}>
        <label className="flex cursor-pointer items-center space-x-3 select-none">
          <input
            ref={ref}
            type="checkbox"
            className={`text-primary focus:ring-primary focus:ring-opacity-20 h-4.5 w-4.5 cursor-pointer rounded border-slate-300 transition duration-150 ease-in-out ${
              error ? "border-rose-500" : "border-slate-300"
            } ${className}`}
            {...props}
          />
          {label && (
            <span className="text-sm font-medium text-slate-700">
              {label}
              {required && <span className="ml-1 text-rose-500">*</span>}
            </span>
          )}
        </label>

        {error && (
          <span className="animate-fadeIn pl-7.5 text-xs font-medium text-rose-600">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
