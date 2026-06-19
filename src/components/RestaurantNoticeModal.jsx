import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import LazyImage from "./LazyImage";

// Using the project's hero background image for the modal visual
const MODAL_IMAGE = "/images/modal/boat.png";

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

          {/* Modal Card - Split Screen Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.15 }}
            className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row md:rounded-[32px]"
          >
            {/* Left Side: Visual Image Banner */}
            <div className="relative h-64 w-full overflow-hidden bg-[#0a0608] md:h-auto md:w-[45%]">
              <LazyImage
                src={MODAL_IMAGE}
                alt="NS Bến Thuyền Không Gian"
                containerClassName="absolute inset-0 w-full h-full"
                className="scale-105 transform object-cover object-center transition-transform duration-[20s] ease-out hover:scale-100"
              />
              {/* Elegant Gradient Overlay */}
              <div className="from-primary/90 via-primary/30 absolute inset-0 bg-gradient-to-t to-transparent mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent" />

              {/* Decorative floating text over image */}
              <div className="absolute right-8 bottom-8 left-8 md:bottom-12 md:left-10">
                <h3 className="font-serif text-2xl leading-snug text-white drop-shadow-lg md:text-3xl">
                  Sự chờ đợi cho một <br />
                  <span className="font-style-italic text-secondary">
                    tuyệt tác ẩm thực
                  </span>
                </h3>
              </div>
            </div>

            {/* Right Side: Typography & Content */}
            <div className="relative flex w-full flex-col justify-center bg-white p-8 md:w-[55%] md:p-12 lg:p-16">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="hover:text-primary absolute top-6 right-6 z-10 cursor-pointer rounded-full p-2.5 text-neutral-400 transition-all hover:bg-neutral-100 md:top-8 md:right-8"
                aria-label="Close modal"
              >
                <FiX size={24} />
              </button>

              <span className="text-secondary mb-4 block text-xs font-semibold tracking-[0.3em] uppercase">
                Thư Ngỏ Gửi Quý Khách
              </span>

              <h2 className="text-primary mb-6 font-serif text-3xl leading-tight tracking-wide uppercase lg:text-4xl">
                CHUẨN BỊ CHO NGÀY KHỞI HÀNH
              </h2>

              <div className="mb-10 space-y-5 font-sans text-sm leading-relaxed text-neutral-600 md:text-base">
                <p>
                  Để mang đến cho Quý khách một không gian ẩm thực duy mỹ cùng
                  những trải nghiệm dịch vụ trọn vẹn nhất,{" "}
                  <strong className="text-primary font-semibold">
                    NS Bến Thuyền
                  </strong>{" "}
                  hiện đang tinh chỉnh những khâu cuối cùng trước ngày ra mắt
                  chính thức.
                </p>
                <p>
                  Trong thời gian chờ đợi, trang thông tin của chúng tôi vẫn mở
                  cửa để Quý khách có thể tự do tìm hiểu trước về không gian,
                  thực đơn và câu chuyện thương hiệu.
                </p>
                <div className="mt-5 border-t border-neutral-100 pt-5">
                  <p className="text-secondary text-xs font-semibold tracking-wider">
                    * Chúng tôi sẽ gửi thông báo chính thức tới Quý khách ngay
                    khi thuyền cập bến và sẵn sàng đón gió.
                  </p>
                </div>
              </div>

              {/* Action Button with 3D Float Hover */}
              <button
                onClick={handleClose}
                className="bg-primary w-fit transform cursor-pointer rounded-full px-10 py-4 text-xs font-semibold tracking-widest text-white uppercase shadow-[0_10px_20px_rgba(38,50,96,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(38,50,96,0.25)] md:text-sm"
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
