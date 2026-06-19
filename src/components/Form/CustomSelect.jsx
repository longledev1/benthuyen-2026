import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiCheck } from "react-icons/fi";

/**
 * CustomSelect: Thành phần Dropdown Select tùy chỉnh giao diện cao cấp
 */
export const CustomSelect = ({
  value,
  onChange,
  options = [], // [{ value, label }]
  placeholder = "",
  className = "",
  buttonClassName = "",
  menuClassName = "",
  customButton = false,
  disabled = false,
  placement = "bottom", // "bottom" | "top"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeOption = options.find((opt) => opt.value === value);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={
          customButton
            ? `flex items-center justify-between cursor-pointer appearance-none focus:outline-none transition-all shadow-sm ${buttonClassName}`
            : `flex items-center justify-between w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-xs font-bold text-slate-700 focus:border-primary focus:outline-none transition-all shadow-sm ${buttonClassName}`
        }
      >
        <span className="flex items-center gap-1.5 min-w-0 flex-1 text-left">
          {typeof (activeOption ? activeOption.label : (placeholder || options[0]?.label)) === "string" ? (
            <span className="truncate w-full block">
              {activeOption ? activeOption.label : (placeholder || (options[0]?.label || ""))}
            </span>
          ) : (
            activeOption ? activeOption.label : (placeholder || (options[0]?.label || ""))
          )}
        </span>
        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
          <FiChevronDown
            size={14}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {/* Floating Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: placement === "top" ? -10 : 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === "top" ? -10 : 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 z-[90] min-w-full rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none ${
              placement === "top" ? "bottom-full mb-2" : "top-full mt-2"
            } ${menuClassName}`}
            style={{ minWidth: "160px" }}
          >
            <div className="space-y-0.5 max-h-60 overflow-y-auto">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary/5 text-primary"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 min-w-0 flex-1 text-left">
                      {typeof opt.label === "string" ? (
                        <span className="truncate w-full block">{opt.label}</span>
                      ) : (
                        opt.label
                      )}
                    </span>
                    {isSelected && (
                      <FiCheck size={12} className="text-primary flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
