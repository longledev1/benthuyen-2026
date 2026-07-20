import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MENU_CATEGORIES } from "../../constants/menu";

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
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ký số La Mã cho 2 cột
  const romanNumerals = ["I", "II"];

  return (
    <div className={`relative w-full select-none ${
      isMobile ? "min-h-screen overflow-y-auto bg-black" : "h-screen overflow-hidden"
    }`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex min-h-[calc(100vh-70px)] md:h-full w-full flex-col md:flex-row pt-20 md:pt-8"
      >
        {MENU_CATEGORIES.map((category, index) => {
          const isHovered = hoveredPanel === index;
          const isAnyHovered = hoveredPanel !== null;
          const isOtherHovered = isAnyHovered && !isHovered;

          return (
            <div
              key={category.id}
              onMouseEnter={() => {
                if (!showModal && !isMobile) setHoveredPanel(index);
              }}
              onMouseMove={() => {
                if (!showModal && !isMobile && hoveredPanel !== index) {
                  setHoveredPanel(index);
                }
              }}
              onMouseLeave={() => {
                if (!isMobile) setHoveredPanel(null);
              }}
              onClick={() => {
                setHoveredPanel(null);
                setShowModal(true);
              }}
              className="relative flex h-[45vh] min-h-[300px] md:h-full flex-1 cursor-pointer items-center justify-center overflow-hidden border-b border-white/10 transition-all duration-700 ease-out md:border-r md:border-b-0"
              style={{
                flexGrow: isMobile ? 1 : (isHovered ? 1.8 : isOtherHovered ? 0.6 : 1),
              }}
            >
              {/* Background Image */}
              <div
                className="absolute -inset-6 bg-cover bg-center transition-all duration-700 ease-out"
                style={{
                  backgroundImage: `url('${category.coverImage}')`,
                  filter: !isMobile && isOtherHovered ? "grayscale(40%) blur(2px)" : "none",
                  transform: !isMobile && isHovered ? "scale(1.05)" : "scale(1)",
                  willChange: "transform, filter",
                }}
              />

              {/* Dark Overlays */}
              <div
                className="absolute inset-0 bg-black transition-opacity duration-700 ease-out"
                style={{
                  opacity: isMobile ? 0.35 : (isHovered ? 0.15 : isOtherHovered ? 0.55 : 0.3),
                }}
              />

              {/* Top-to-bottom subtle gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />

              {/* Content Container */}
              <div className="relative z-10 flex h-full w-full flex-col items-center justify-between p-6 text-center md:p-12">
                {/* Top element: Roman Numeral */}
                <div
                  className="font-normalt text-secondary font-serif text-lg tracking-[0.3em] transition-all duration-500 ease-out sm:text-xl"
                  style={{
                    transform: isMobile || isHovered ? "translateY(0)" : "translateY(-8px)",
                    opacity: !isMobile && isOtherHovered ? 0.4 : 1,
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
                      transform: !isMobile && isHovered ? "scale(1.04)" : "scale(1)",
                      letterSpacing: isMobile || isHovered ? "0.22em" : "0.15em",
                    }}
                  >
                    {category.title}
                    <span className="font-normalt mt-1 block font-sans text-sm tracking-[0.2em] text-white sm:mt-2 sm:text-base md:text-lg">
                      {category.subTitleLabel}
                    </span>
                  </h2>

                  {/* Line divider */}
                  <div
                    className="bg-secondary my-4 h-[1px] transition-all duration-500 ease-out sm:my-6"
                    style={{
                      width: isMobile || isHovered ? "80px" : "40px",
                      opacity: !isMobile && isOtherHovered ? 0.3 : 1,
                    }}
                  />

                  {/* Expandable Tagline / Description */}
                  <div
                    className="font-normalt overflow-hidden font-sans text-xs leading-relaxed tracking-wider text-gray-200 drop-shadow-md transition-all duration-500 ease-out sm:text-sm"
                    style={{
                      opacity: isMobile || isHovered ? 1 : 0,
                      maxHeight: isMobile || isHovered ? "120px" : "0px",
                      marginTop: isMobile || isHovered ? "0px" : "-10px",
                      visibility: isMobile || isHovered ? "visible" : "hidden",
                    }}
                  >
                    {category.subtitle}
                  </div>
                </div>

                {/* Bottom element: Call to Action / Explore button */}
                <div className="flex h-12 items-center justify-center">
                  <div
                    className="border-secondary text-secondary hover:bg-secondary rounded-full border px-6 py-2 text-[11px] font-medium tracking-[0.25em] uppercase transition-all duration-500 ease-out hover:text-black"
                    style={{
                      opacity: isMobile || isHovered ? 1 : 0,
                      transform: isMobile || isHovered
                        ? "translateY(0)"
                        : "translateY(12px)",
                      visibility: isMobile || isHovered ? "visible" : "hidden",
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
