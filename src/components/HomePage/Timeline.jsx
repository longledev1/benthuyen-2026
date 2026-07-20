import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import LazyImage from "../LazyImage";
import "swiper/css";
import "swiper/css/pagination";

import { TIMELINE_DATA } from "../../constants/timeline";

const TimelineSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const milestonesSwiperRef = useRef(null); // Ref điều khiển Swiper lớn (các năm)
  const navContainerRef = useRef(null); // Ref cuộn giữa tab active trên mobile
  const currentData = TIMELINE_DATA[activeIndex];

  // Tự động cuộn căn giữa tab mốc thời gian đang active trên Mobile
  useEffect(() => {
    if (navContainerRef.current) {
      const activeEl = navContainerRef.current.querySelector(
        '[data-active="true"]',
      );
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeIndex]);

  // Xử lý khi click chọn Tab Navigation
  const handleTabClick = (index) => {
    setActiveIndex(index);
    if (milestonesSwiperRef.current && milestonesSwiperRef.current.swiper) {
      milestonesSwiperRef.current.swiper.slideTo(index);
    }
  };

  return (
    <section className="bg-primary-gradient relative flex min-h-[700px] items-center overflow-hidden py-12 text-white md:min-h-[800px] md:py-24">
      {/* 👇 LINE FULL HEIGHT - Chỉ hiện trên Desktop */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ originY: 0 }}
        className="pointer-events-none absolute top-0 bottom-0 left-[94.6%] hidden w-[1px] bg-white/30 lg:block"
      />

      <div className="container mx-auto px-6">
        {/* --- LAYOUT CHO MOBILE/TABLET (lg:hidden) --- */}
        <div className="flex flex-col lg:hidden">
          {/* 1. Navigation ngang (Scrollable) */}
          <div
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <motion.div
              ref={navContainerRef}
              initial={{ opacity: 0, y: -15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="no-scrollbar mb-10 flex w-full snap-x snap-mandatory space-x-8 overflow-x-scroll scroll-smooth pb-4 [-webkit-overflow-scrolling:touch]"
            >
              {TIMELINE_DATA.map((item, index) => (
                <button
                  key={item.id}
                  data-active={activeIndex === index}
                  onClick={() => handleTabClick(index)}
                  className={`relative shrink-0 snap-center pb-3 text-sm tracking-widest whitespace-nowrap uppercase transition-all ${
                    activeIndex === index
                      ? "font-bold text-white"
                      : "text-white/60"
                  }`}
                >
                  {item.label}
                  {activeIndex === index && (
                    <motion.div
                      layoutId="activeMobileTabLine"
                      className="absolute right-0 bottom-0 left-0 h-[2px] bg-white"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 25,
                      }}
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Swiper lớn: Trượt qua lại các Mốc thời gian (Tabs) */}
          <Swiper
            ref={milestonesSwiperRef}
            initialSlide={0}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="w-full"
            spaceBetween={30}
            touchStartPreventDefault={false}
          >
            {TIMELINE_DATA.map((item) => (
              <SwiperSlide key={item.id} className="flex flex-col">
                {/* 2. Nội dung Text */}
                <div className="mb-8 min-h-[180px]">
                  <h2 className="mb-4 font-sans text-2xl font-bold text-white">
                    {item.title}
                  </h2>
                  <div className="bg-secondary mb-6 h-[1px] w-20"></div>
                  {item.desc.map((p, i) => (
                    <p
                      key={i}
                      className="font-normalt mb-4 text-sm leading-relaxed text-gray-300"
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {/* 3. Slider Ảnh của mốc thời gian đó */}
                <div className="relative z-20 w-full group/slider">
                  <Swiper
                    modules={[Pagination, Navigation]}
                    pagination={{ clickable: true }}
                    navigation={{
                      prevEl: `.prev-btn-${item.id}`,
                      nextEl: `.next-btn-${item.id}`,
                    }}
                    spaceBetween={20}
                    nested={true} // 👈 Ngăn không cho vuốt ảnh làm chuyển năm (tab lớn)
                    className="h-[350px] w-full rounded-sm"
                  >
                    {item.images.map((img, idx) => (
                      <SwiperSlide key={idx}>
                        <LazyImage
                          src={img}
                          className="object-cover"
                          alt="timeline"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Nút điều hướng ảnh trái/phải trên Mobile/Tablet */}
                  <button
                    className={`prev-btn-${item.id} absolute left-3 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/60 active:scale-90 disabled:pointer-events-none disabled:opacity-0`}
                    aria-label="Ảnh trước"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <button
                    className={`next-btn-${item.id} absolute right-3 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/60 active:scale-90 disabled:pointer-events-none disabled:opacity-0`}
                    aria-label="Ảnh sau"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* --- LAYOUT CHO DESKTOP (Keep nguyên bản của bạn) --- */}
        <div className="hidden grid-cols-12 items-center gap-8 lg:grid">
          {/* BÊN TRÁI: Text Content */}
          <div className="z-10 col-span-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-hand mb-6 text-[35px] text-white/90">
                  {currentData.title}
                </h2>
                <div className="mb-8 h-[1px] w-40 bg-white"></div>
                {currentData.desc.map((p, i) => (
                  <p key={i} className="font-normalt mb-6 leading-relaxed">
                    {p}
                  </p>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Ở GIỮA: Mosaic Images */}
          <div className="col-span-6 flex h-[600px] items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="grid h-full w-full max-w-[600px] grid-cols-2 grid-rows-2 gap-10"
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <motion.div
                  variants={imgVariants(0.1)}
                  whileHover={{ scale: 1.03, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="translate-y-6 cursor-pointer p-1"
                >
                  <LazyImage
                    src={currentData.images[0]}
                    className="aspect-square object-cover"
                  />
                </motion.div>
                <motion.div
                  variants={imgVariants(0.3)}
                  whileHover={{ scale: 1.03, rotate: -1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="cursor-pointer p-1"
                >
                  <LazyImage
                    src={currentData.images[1]}
                    className="aspect-square object-cover"
                  />
                </motion.div>
                <motion.div
                  variants={imgVariants(0.5)}
                  whileHover={{ scale: 1.03, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="cursor-pointer p-1"
                >
                  <LazyImage
                    src={currentData.images[2]}
                    className="aspect-[4/5] object-cover"
                  />
                </motion.div>
                <motion.div
                  variants={imgVariants(0.7)}
                  whileHover={{ scale: 1.03, rotate: -1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="-translate-y-6 cursor-pointer p-1"
                >
                  <LazyImage
                    src={currentData.images[3]}
                    className="aspect-square object-cover"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* BÊN PHẢI: Navigation */}
          <div className="relative col-span-2 flex h-full flex-col items-end justify-center py-10">
            <div className="flex flex-col items-end space-y-16 pr-8">
              {TIMELINE_DATA.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(index)}
                  className="group relative flex items-center justify-end"
                >
                  <span
                    className={`font-normalt mr-6 text-[12px] transition-all duration-300 ${
                      activeIndex === index
                        ? "scale-110 font-medium text-white"
                        : "text-white/60 group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                  <div
                    className={`absolute -right-[39px] z-10 h-4 w-4 rounded-full border-2 bg-transparent transition-all duration-300 ${
                      activeIndex === index
                        ? "border-white"
                        : "border-white/40 group-hover:border-white"
                    }`}
                  >
                    {activeIndex === index && (
                      <motion.div
                        layoutId="activeTimelineDot"
                        className="absolute inset-0 scale-[1.3] rounded-full border-2 border-white bg-white"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const imgVariants = (delay) => ({
  initial: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { delay, duration: 0.8, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 1.1,
    filter: "blur(10px)",
    transition: { duration: 0.4 },
  },
});

export default TimelineSection;
