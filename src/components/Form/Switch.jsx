import React, { forwardRef } from "react";

/**
 * Switch Component (Toggle Switch) hỗ trợ forwardRef để tích hợp mượt mà với react-hook-form register
 */
export const Switch = forwardRef(
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
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              className="peer sr-only"
              {...props}
            />
            {/* Switch track */}
            <div className="peer-checked:bg-primary peer-focus:ring-primary/20 h-6 w-10 rounded-full bg-slate-200 transition-colors peer-focus:ring-2 peer-focus:outline-none dark:bg-slate-300"></div>
            {/* Switch thumb */}
            <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4"></div>
          </div>

          {label && (
            <span className="text-sm font-medium text-slate-700">
              {label}
              {required && <span className="ml-1 text-rose-500">*</span>}
            </span>
          )}
        </label>

        {error && (
          <span className="animate-fadeIn pl-13 text-xs font-medium text-rose-600">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
