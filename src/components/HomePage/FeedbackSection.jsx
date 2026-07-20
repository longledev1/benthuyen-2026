import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoStar,
} from "react-icons/io5";

import "swiper/css";
import "swiper/css/pagination";
import { FEEDBACK_DATA } from "../../constants/feedback-data";

const FeedbackSection = () => {
  const swiperRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check màn hình để thay đổi logic hiển thị
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Logic chia nhóm 5 chỉ dành cho Desktop
  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size),
    );
  };

  const feedbackGroups = chunkArray(FEEDBACK_DATA, 5);

  return (
    <section className="mt-[-50px] overflow-hidden">
      <div className="container mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-8 max-w-4xl text-center"
        >
          <h2 className="md:font-script text-primary font-sans text-3xl leading-tight md:text-[55px]">
            <span className="text-secondary block">Thanh âm từ</span>
            <span className="text-primary mt-1 block md:mt-[-25px]">
              Những thực khách tinh tế
            </span>
          </h2>
          <p className="font-normalt mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 md:text-base">
            Mỗi lời chia sẻ từ thực khách là minh chứng cho sự tận tâm mà Bến
            Thuyền luôn theo đuổi. Từ hương vị món ăn, chất lượng phục vụ đến
            không gian thưởng thức
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={16}
            // Mobile: hiện 2 slide, Desktop: hiện 1 cụm (slide)
            slidesPerView={isMobile ? 1.2 : 1}
            slidesPerGroup={isMobile ? 1 : 1}
            speed={1000}
            breakpoints={{
              640: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
              1024: { slidesPerView: 1, slidesPerGroup: 1 },
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="!static pb-12"
          >
            {isMobile
              ? // RENDER MOBILE: Mỗi card là một slide ngang
                FEEDBACK_DATA.map((item) => (
                  <SwiperSlide key={item.id} className="h-auto">
                    <FeedbackCard item={item} />
                  </SwiperSlide>
                ))
              : // RENDER DESKTOP: Mỗi slide là một cụm 5 card (3+2)
                feedbackGroups.map((group, index) => (
                  <SwiperSlide key={index}>
                    <div className="flex flex-col gap-6">
                      <div className="grid grid-cols-3 gap-6">
                        {group.slice(0, 3).map((item) => (
                          <FeedbackCard key={item.id} item={item} />
                        ))}
                      </div>
                      <div className="flex justify-center gap-6">
                        {group.slice(3, 5).map((item) => (
                          <div
                            key={item.id}
                            className="w-[calc(33.333%-1rem)] md:w-full"
                          >
                            <FeedbackCard item={item} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
          </Swiper>

          {/* Nút điều hướng */}
          <div className="mt-4 flex hidden items-center justify-center space-x-6 md:mt-8 md:flex">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="text-primary hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:text-white md:h-12 md:w-12"
            >
              <IoChevronBackOutline size={isMobile ? 18 : 20} />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="text-primary hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:text-white md:h-12 md:w-12"
            >
              <IoChevronForwardOutline size={isMobile ? 18 : 20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Component Card được tối ưu padding cho mobile
const FeedbackCard = ({ item }) => (
  <motion.div
    whileHover={{ y: -6, boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}
    transition={{ type: "spring", stiffness: 400, damping: 20 }}
    className="border-secondary hover:border-secondary flex h-full flex-col rounded-xl border bg-white p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all duration-300 md:p-10"
  >
    <div className="text-secondary mb-4 md:mb-6">
      <svg
        className="h-4 w-6 md:h-6 md:w-8"
        viewBox="0 0 34 24"
        fill="currentColor"
      >
        <path d="M0 24V11.52C0 4.8 4.32 1.44 9.12 0L10.56 2.88C7.68 4.32 5.76 7.2 5.76 10.08H10.56V24H0ZM19.2 24V11.52C19.2 4.8 23.52 1.44 28.32 0L29.76 2.88C26.88 4.32 24.96 7.2 24.96 10.08H29.76V24H19.2Z" />
      </svg>
    </div>

    <p className="font-normalt mb-6 flex-grow text-xs leading-relaxed text-gray-500 italic md:mb-10 md:text-sm md:leading-[1.8]">
      {item.comment}
    </p>

    <div className="flex items-center justify-between border-t border-gray-50 pt-4 md:pt-6">
      <h4 className="text-primary text-xs font-bold tracking-wide md:text-base">
        {item.name}
      </h4>
      <div className="flex space-x-0.5">
        {[...Array(item.stars)].map((_, index) => (
          <IoStar
            key={index}
            className="text-secondary h-3 w-3 md:h-4 md:w-4"
          />
        ))}
      </div>
    </div>
  </motion.div>
);

export default FeedbackSection;
