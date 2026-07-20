import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiX,
} from "react-icons/fi";

/**
 * Hộp thoại xác nhận hành động (Thay thế window.confirm)
 */
export const ConfirmModal = ({
  isOpen,
  title = "Xác nhận hành động",
  message = "Bạn có chắc chắn muốn thực hiện hành động này không?",
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  onConfirm,
  onCancel,
  type = "danger", // danger | warning | info
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay nền mờ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Hộp thoại nội dung */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="relative z-10 w-full max-w-md space-y-4 overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-xl"
          >
            <div className="flex items-start space-x-3.5">
              {/* Icon cảnh báo theo loại */}
              <div
                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
                  type === "danger"
                    ? "bg-rose-50 text-rose-500"
                    : type === "warning"
                      ? "bg-amber-50 text-amber-500"
                      : "bg-blue-50 text-blue-500"
                }`}
              >
                {type === "danger" || type === "warning" ? (
                  <FiAlertTriangle size={20} />
                ) : (
                  <FiInfo size={20} />
                )}
              </div>

              {/* Chi tiết nội dung */}
              <div className="flex-1 space-y-1">
                <h3 className="text-primary text-base font-bold">{title}</h3>
                <p className="font-normalt text-xs leading-relaxed text-slate-500">
                  {message}
                </p>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold tracking-wider text-slate-500 uppercase transition-all hover:bg-slate-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-bold tracking-wider text-white uppercase transition-all ${
                  type === "danger"
                    ? "bg-rose-500 hover:bg-rose-600"
                    : type === "warning"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-primary hover:bg-primary/90"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * Component Toast thông báo nhỏ (Thay thế window.alert)
 */
export const ToastNotification = ({
  message,
  type = "success", // success | error | info
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`fixed top-6 right-6 z-[200] flex max-w-sm min-w-[300px] items-center space-x-3 rounded-xl border bg-white p-4 shadow-lg ${
        type === "success"
          ? "border-emerald-100 shadow-emerald-500/5"
          : type === "error"
            ? "border-rose-100 shadow-rose-500/5"
            : "border-blue-100 shadow-blue-500/5"
      }`}
    >
      {/* Icon */}
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
          type === "success"
            ? "bg-emerald-50 text-emerald-500"
            : type === "error"
              ? "bg-rose-50 text-rose-500"
              : "bg-blue-50 text-blue-500"
        }`}
      >
        {type === "success" && <FiCheckCircle size={18} />}
        {type === "error" && <FiXCircle size={18} />}
        {type === "info" && <FiInfo size={18} />}
      </div>

      {/* Message */}
      <div className="flex-1 pr-2">
        <p className="text-xs leading-normal font-semibold text-slate-700">
          {message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
      >
        <FiX size={16} />
      </button>
    </motion.div>
  );
};
