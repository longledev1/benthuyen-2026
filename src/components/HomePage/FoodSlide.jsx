import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination } from "swiper/modules";
import LazyImage from "../LazyImage";
// Import Icons
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import { FOOD_GALLERY_DATA } from "../../constants/food-slide";

const FoodSlide = () => {
  const swiperRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const allImagesMobile = FOOD_GALLERY_DATA.flatMap((item) => item.images);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 md:px-0">
        {/* --- HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-8 max-w-4xl text-center md:mb-16"
        >
          <h2 className="md:font-script text-primary font-sans text-3xl leading-tight md:text-[55px]">
            <span className="text-secondary block">Những dấu ấn</span>
            <span className="text-primary mt-1 block md:mt-[-25px]">
              Ẩm thực tại Bến Thuyền
            </span>
          </h2>
          <p className="font-normalt mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 md:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ex nam
            consectetur hic neque accusatium.
          </p>
        </motion.div>

        {/* --- SWIPER --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <Swiper
            key={isMobile ? "mobile-carousel" : "desktop-mosaic"}
            modules={[EffectFade, Navigation, Pagination]}
            slidesPerView={isMobile ? 1.3 : 1}
            centeredSlides={isMobile}
            spaceBetween={isMobile ? 20 : 0}
            watchSlidesProgress={true}
            grabCursor={true}
            loop={!isMobile}
            effect={isMobile ? "slide" : "fade"}
            speed={800}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={handleSlideChange}
            className="food-swiper pb-12 md:pb-0"
          >
            {isMobile
              ? allImagesMobile.map((img, idx) => (
                  <SwiperSlide key={`mob-${idx}`}>
                    {({ isActive }) => (
                      <div
                        className={`h-[450px] w-full transition-all duration-700 ease-in-out ${
                          isActive
                            ? "blur-0 scale-100 opacity-100"
                            : "scale-90 opacity-30 blur-[2px]"
                        }`}
                      >
                        <LazyImage
                          src={img}
                          className="rounded-2xl object-cover shadow-2xl"
                          alt={`Food ${idx}`}
                        />
                      </div>
                    )}
                  </SwiperSlide>
                ))
              : FOOD_GALLERY_DATA.map((item) => (
                  <SwiperSlide key={`desk-${item.id}`}>
                    {({ isActive }) => (
                      <div className="grid h-[700px] grid-cols-12 gap-5 px-6">
                        {/* Ảnh lớn bên trái */}
                        <motion.div
                          initial={{ opacity: 0, x: -40 }}
                          animate={
                            isActive
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: -40 }
                          }
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="col-span-4 h-full"
                        >
                          <LazyImage
                            src={item.images[0]}
                            className="rounded-sm object-cover shadow-lg"
                            alt="main"
                          />
                        </motion.div>

                        {/* 4 ảnh nhỏ bên phải */}
                        <div className="col-span-8 grid h-full grid-cols-2 grid-rows-2 gap-5">
                          {item.images.slice(1, 5).map((img, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.92 }}
                              animate={
                                isActive
                                  ? { opacity: 1, scale: 1 }
                                  : { opacity: 0, scale: 0.92 }
                              }
                              transition={{
                                duration: 0.6,
                                delay: idx * 0.1,
                                ease: "easeOut",
                              }}
                              whileHover={{ scale: 1.02 }}
                              className="cursor-pointer overflow-hidden rounded-sm shadow-md"
                            >
                              <LazyImage
                                src={img}
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                                alt="sub"
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </SwiperSlide>
                ))}
          </Swiper>

          {/* --- NÚT ĐIỀU HƯỚNG BẰNG ICON --- */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 hidden items-center justify-center space-x-12 md:flex"
          >
            {/* Nút Prev */}
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              className={`flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 shadow-sm transition-all duration-300 ${
                isBeginning
                  ? "cursor-not-allowed opacity-20"
                  : "text-primary hover:bg-primary bg-white hover:text-white hover:shadow-xl active:scale-90"
              }`}
            >
              <IoChevronBackOutline size={24} />
            </button>

            {/* Vạch ngăn cách dọc */}
            <div className="h-10 w-[1px] bg-gray-200"></div>

            {/* Nút Next */}
            <button
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              className={`flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 shadow-sm transition-all duration-300 ${
                isEnd
                  ? "cursor-not-allowed opacity-20"
                  : "text-primary hover:bg-primary bg-white hover:text-white hover:shadow-xl active:scale-90"
              }`}
            >
              <IoChevronForwardOutline size={24} />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FoodSlide;
