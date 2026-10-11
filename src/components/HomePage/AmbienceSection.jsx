import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

// Import Icons từ react-icons
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { AMBIENCE_DATA } from "../../constants/ambience";

import LazyImage from "../LazyImage";
import EdgeDecorator from "../EdgeDecorator";

const AmbienceSection = () => {
  const swiperRef = useRef(null);

  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-8 md:pt-16 md:pb-12">
      <div className="container mx-auto px-6">
        {/* HEADER SECTION - Centered layout */}
        <div className="relative mb-12 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl text-center"
          >
            <h3 className="text-secondary font-anton mb-4 text-2xl tracking-widest uppercase md:text-4xl">
              L' Ambiance
            </h3>
            <h2 className="text-primary font-kanit md:font-script text-xl sm:text-3xl md:text-[52px] font-light md:font-normal leading-relaxed md:leading-[60px]">
              Không gian được tạo nên từ sự tinh giản, ấm cúng{" "}
              <br className="hidden md:block" />
              và cảm hứng <span className="whitespace-nowrap">đương đại</span>
            </h2>
          </motion.div>
        </div>

        {/* SWIPER SLIDE CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="group relative"
        >
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={16}
            slidesPerView={1.2}
            loop={true}
            speed={1000}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="!static h-[380px] sm:h-[460px] md:h-[550px] ambience-swiper"
            /* !static để các nút absolute căn theo thẻ group ngoài cùng */
          >
            {AMBIENCE_DATA.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="group/item relative h-full w-full overflow-hidden rounded-sm shadow-lg">
                  <LazyImage
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover/item:scale-110"
                  />

                  {/* Overlay & Caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                  <div className="absolute right-6 bottom-8 left-6 md:right-8 md:bottom-10 md:left-8">
                    <p className="font-normalt text-base tracking-wide text-white italic md:text-lg">
                      {item.title}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* FIX: NAVIGATION BUTTONS (Sử dụng React Icons) */}
          {/* Nút Prev */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Xem không gian trước"
            className="text-primary absolute top-1/2 left-0 z-30 hidden h-12 w-12 -translate-x-6 -translate-y-1/2 items-center justify-center rounded-full bg-white opacity-0 shadow-2xl transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:bg-[#1A2542] hover:text-white md:left-4 md:flex"
          >
            <IoChevronBackOutline size={24} />
          </button>

          {/* Nút Next - Fix lỗi đẩy lề phải */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Xem không gian tiếp theo"
            className="text-primary absolute top-1/2 right-0 z-30 hidden h-12 w-12 translate-x-6 -translate-y-1/2 items-center justify-center rounded-full bg-white opacity-0 shadow-2xl transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:bg-[#1A2542] hover:text-white md:right-4 md:flex"
          >
            <IoChevronForwardOutline size={24} />
          </button>
        </motion.div>
      </div>

      {/* Elegant Gold Divider */}
      <div className="container mx-auto px-6 pt-10 pb-2 flex items-center justify-center select-none">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent flex-1" />
        <div className="mx-4 flex items-center justify-center">
          <svg className="w-5 h-5 text-secondary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L15 8H9L12 2Z" fill="currentColor"/>
            <path d="M12 22L9 16H15L12 22Z" fill="currentColor"/>
            <circle cx="12" cy="12" r="2.2" fill="currentColor"/>
          </svg>
        </div>
        <div className="h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent flex-1" />
      </div>
      {/* San hô vàng trang trí ở góc dưới bên trái sát mép màn hình */}
      <EdgeDecorator
        type="coral"
        position="bottom-left"
        className="-bottom-20 -left-12 w-40 opacity-65 md:w-60 lg:w-72"
      />
      {/* Custom Styles for Swiper Pagination on Mobile */}
      <style>{`
        .ambience-swiper .swiper-pagination {
          position: relative !important;
          margin-top: 24px;
          bottom: 0 !important;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
        }
        @media (min-width: 768px) {
          .ambience-swiper .swiper-pagination {
            display: none !important;
          }
        }
        .ambience-swiper .swiper-pagination-bullet {
          background-color: #cbd5e1 !important;
          opacity: 0.6 !important;
          width: 7px;
          height: 7px;
          border-radius: 9999px;
          transition: all 0.3s ease;
          margin: 0 !important;
        }
        .ambience-swiper .swiper-pagination-bullet-active {
          background-color: #cfb26e !important;
          opacity: 1 !important;
          width: 18px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
};

export default AmbienceSection;
