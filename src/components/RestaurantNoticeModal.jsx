import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

export const RestaurantNoticeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the notice in this session
    const hasSeen = sessionStorage.getItem("hasSeenRestaurantNotice");
    if (!hasSeen) {
      // Show modal after a small delay (1.2 seconds) for a premium, smooth feeling
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenRestaurantNotice", "true");
  };

  // Khóa cuộn trang nền khi mở thông báo
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 md:px-8">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleClose}
            className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-md"
          />

          {/* Modal Card - Centered Clean Document Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.15 }}
            className="relative flex w-full max-w-2xl flex-col rounded-2xl bg-white p-8 text-slate-800 shadow-2xl md:rounded-[32px] md:p-14"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="hover:text-primary absolute top-4 right-4 z-10 cursor-pointer rounded-full p-2 text-neutral-400 transition-all hover:bg-neutral-100 md:top-6 md:right-6"
              aria-label="Close modal"
            >
              <FiX size={24} />
            </button>

            {/* Logo Center */}
            <div className="mb-6 flex justify-center">
              <img
                src="/logo/logo_scroll.png"
                alt="NS Bến Thuyền Logo"
                className="h-16 w-auto object-contain md:h-24"
              />
            </div>

            {/* Subtitle */}
            <span className="text-secondary mb-2 block text-center text-[10px] font-bold tracking-[0.3em] uppercase md:text-xs">
              Thư Ngỏ Gửi Quý Khách
            </span>

            {/* Main Title */}
            <h2 className="text-primary mb-4 block text-center font-serif text-2xl leading-tight tracking-wide uppercase md:text-3xl">
              CHUẨN BỊ CHO NGÀY KHỞI HÀNH
            </h2>

            {/* Line Divider */}
            <div className="bg-secondary/40 mx-auto mb-6 h-[1.5px] w-16" />

            {/* Paragraphs - Left aligned but centered container for readability */}
            <div className="mb-8 space-y-4 font-sans text-xs leading-relaxed text-neutral-600 md:text-sm">
              <p className="text-justify md:text-left">
                Để mang đến cho Quý khách một không gian ẩm thực ấm cúng cùng
                chất lượng dịch vụ trọn vẹn nhất,{" "}
                <strong className="text-primary font-semibold">
                  NS Bến Thuyền
                </strong>{" "}
                hiện đang hoàn thiện những khâu cuối cùng trước ngày chính thức
                đón khách.
              </p>
              <p className="text-justify md:text-left">
                Hành trình mới lần này là sự kết nối giữa giá trị nguyên bản của{" "}
                <span className="text-primary font-bold">Ngọc Sương </span> và
                những hương vị sáng tạo độc đáo mà chúng tôi đã chắt lọc được.
              </p>
              <p className="text-justify md:text-left">
                Trong thời gian chuẩn bị, trang thông tin của chúng tôi vẫn mở
                để Quý khách có thể tìm hiểu trước về không gian, thực đơn và
                câu chuyện thương hiệu.
              </p>
              <div className="mt-5 border-t border-neutral-100 pt-4">
                <p className="text-secondary text-center text-[11px] font-semibold tracking-wider md:text-xs">
                  * Ngày khai trương chính thức và thông tin đặt bàn sẽ được cập
                  nhật tại đây
                </p>
              </div>
            </div>

            {/* Center Action Button */}
            <div className="flex justify-center">
              <button
                onClick={handleClose}
                className="bg-primary w-fit transform cursor-pointer rounded-full px-8 py-3 text-xs font-semibold tracking-widest text-white uppercase shadow-[0_10px_20px_rgba(38,50,96,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(38,50,96,0.25)] md:px-10 md:py-4"
              >
                Khám Phá Website
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
