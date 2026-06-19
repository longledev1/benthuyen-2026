import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MENU_CATEGORIES = [
  {
    id: "alacarte",
    title: "A LÀ CARTE",
    subTitleLabel: "MENU",
    subtitle:
      "Những món ăn được chắt lọc từ tinh hoa nguyên liệu và nghệ thuật chế biến",
    coverImage: "/images/menu/ala.png",
  },
  {
    id: "catering",
    title: "CATERING",
    subTitleLabel: "MENU",
    subtitle:
      "Dịch vụ ẩm thực trọn gói, phục vụ hoàn hảo cho mọi quy mô sự kiện",
    coverImage: "/images/menu/cate.png",
  },
];

const IconX = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const MenuPage = () => {
  const [hoveredPanel, setHoveredPanel] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Ký số La Mã cho 2 cột
  const romanNumerals = ["I", "II"];

  return (
    <div className="overflow-hiddenselect-none relative h-screen w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mt-8 flex h-full w-full flex-col md:flex-row"
      >
        {MENU_CATEGORIES.map((category, index) => {
          const isHovered = hoveredPanel === index;
          const isAnyHovered = hoveredPanel !== null;
          const isOtherHovered = isAnyHovered && !isHovered;

          return (
            <div
              key={category.id}
              onMouseEnter={() => {
                if (!showModal) setHoveredPanel(index);
              }}
              onMouseMove={() => {
                if (!showModal && hoveredPanel !== index) {
                  setHoveredPanel(index);
                }
              }}
              onMouseLeave={() => {
                setHoveredPanel(null);
              }}
              onClick={() => {
                setHoveredPanel(null);
                setShowModal(true);
              }}
              className="relative flex h-full flex-1 cursor-pointer items-center justify-center overflow-hidden border-b border-white/5 transition-all duration-700 ease-out md:border-r md:border-b-0"
              style={{
                flexGrow: isHovered ? 1.8 : isOtherHovered ? 0.6 : 1,
              }}
            >
              {/* Background Image */}
              <div
                className="absolute -inset-6 bg-cover bg-center transition-all duration-700 ease-out"
                style={{
                  backgroundImage: `url('${category.coverImage}')`,
                  filter: isOtherHovered ? "grayscale(40%) blur(2px)" : "none",
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                  willChange: "transform, filter",
                }}
              />

              {/* Dark Overlays */}
              <div
                className="absolute inset-0 bg-black transition-opacity duration-700 ease-out"
                style={{
                  opacity: isHovered ? 0.15 : isOtherHovered ? 0.55 : 0.3,
                }}
              />

              {/* Top-to-bottom subtle gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />

              {/* Content Container */}
              <div className="relative z-10 flex h-full w-full flex-col items-center justify-between p-8 text-center md:p-12">
                {/* Top element: Roman Numeral */}
                <div
                  className="font-normalt text-secondary font-serif text-lg tracking-[0.3em] transition-all duration-500 ease-out sm:text-xl"
                  style={{
                    transform: isHovered ? "translateY(0)" : "translateY(-8px)",
                    opacity: isOtherHovered ? 0.4 : 1,
                  }}
                >
                  {romanNumerals[index]}
                </div>

                {/* Center element: Typography and Description */}
                <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center">
                  {/* Serif Category Title */}
                  <h2
                    className="font-serif text-2xl whitespace-nowrap text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] transition-all duration-500 ease-out sm:text-3xl md:text-4xl lg:text-[40px]"
                    style={{
                      transform: isHovered ? "scale(1.04)" : "scale(1)",
                      letterSpacing: isHovered ? "0.22em" : "0.15em",
                    }}
                  >
                    {category.title}
                    <span className="font-normalt mt-1 block font-sans text-sm tracking-[0.2em] text-white sm:mt-2 sm:text-base md:text-lg">
                      {category.subTitleLabel}
                    </span>
                  </h2>

                  {/* Line divider */}
                  <div
                    className="bg-secondary my-5 h-[1px] transition-all duration-500 ease-out sm:my-6"
                    style={{
                      width: isHovered ? "80px" : "40px",
                      opacity: isOtherHovered ? 0.3 : 1,
                    }}
                  />

                  {/* Expandable Tagline / Description */}
                  <div
                    className="font-normalt overflow-hidden font-sans text-xs leading-relaxed tracking-wider text-gray-200 drop-shadow-md transition-all duration-500 ease-out sm:text-sm"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      maxHeight: isHovered ? "120px" : "0px",
                      marginTop: isHovered ? "0px" : "-10px",
                      visibility: isHovered ? "visible" : "hidden",
                    }}
                  >
                    {category.subtitle}
                  </div>
                </div>

                {/* Bottom element: Call to Action / Explore button */}
                <div className="flex h-12 items-center justify-center">
                  <div
                    className="border-secondary text-secondary hover:bg-secondary rounded-full border px-6 py-2.5 text-[11px] font-medium tracking-[0.25em] uppercase transition-all duration-500 ease-out hover:text-black"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered
                        ? "translateY(0)"
                        : "translateY(12px)",
                      visibility: isHovered ? "visible" : "hidden",
                    }}
                  >
                    Khám Phá
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* POPUP THÔNG BÁO */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Lớp phủ Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-[#1A2542]/40 backdrop-blur-md"
            />

            {/* Nội dung Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="border-secondary relative z-[101] w-full max-w-md rounded-sm border-t-[6px] bg-white p-10 text-center shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="hover:text-primary absolute top-4 right-4 cursor-pointer text-gray-400 transition-colors"
              >
                <IconX className="h-6 w-6" />
              </button>

              <div className="mb-8">
                <h3 className="text-primary mb-4 font-serif text-2xl tracking-widest uppercase">
                  Thông báo
                </h3>
                <p className="font-normalt leading-relaxed text-gray-500">
                  Thực đơn mới hiện đang được chúng tôi cập nhật để mang lại
                  trải nghiệm tốt nhất cho quý khách.
                  <br />
                  <br />
                  NS Bến Thuyền sẽ cố gắng hoàn thiện trong thời gian nhanh nhất
                  để đăng tải lên website.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="bg-primary w-full cursor-pointer rounded-sm py-4 text-[11px] font-bold tracking-[0.3em] text-white uppercase shadow-lg transition-all hover:opacity-90 active:scale-95"
              >
                Đồng ý
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;
