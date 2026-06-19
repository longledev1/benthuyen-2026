import React, { forwardRef } from "react";

/**
 * TextField Component hỗ trợ forwardRef để tích hợp mượt mà với react-hook-form register
 */
export const TextField = forwardRef(
  (
    {
      label,
      error,
      type = "text",
      placeholder,
      required = false,
      icon: Icon,
      className = "",
      containerClassName = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`flex w-full flex-col space-y-1.5 ${containerClassName}`}>
        {label && (
          <label className="text-primary flex items-center text-xs font-semibold tracking-wide uppercase">
            {label}
            {required && <span className="ml-1 text-rose-500">*</span>}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Icon size={16} />
            </span>
          )}

          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={`w-full rounded-lg border bg-slate-50 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-1 focus:outline-none ${
              Icon ? "pl-10" : "px-4"
            } ${
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
                : "focus:border-primary focus:ring-primary border-slate-300"
            } ${className}`}
            {...props}
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

TextField.displayName = "TextField";

export default TextField;
