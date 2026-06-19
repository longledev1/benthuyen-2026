import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Import Icons từ react-icons
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import { AMBIENCE_DATA } from "../../constants/ambience";

import LazyImage from "../LazyImage";

const AmbienceSection = () => {
  const swiperRef = useRef(null);

  return (
    <section className="overflow-hidden bg-white">
      <div className="container mx-auto">
        {/* HEADER SECTION */}
        <div className="mb-10 flex flex-col-reverse items-end justify-between gap-6 md:flex-row md:gap-10">
          {/* Trái: Mô tả Lorem */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-1/3"
          >
            <p className="font-normalt text-left text-sm leading-relaxed text-gray-500 md:text-justify">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex nam
              consectetur hic neque accusantium. Rem delectus blanditiis
              provident ipsam cumque, unde alias! Voluptatem laboriosam aliquam
              tempore rerum laudantium vel laborum?Lorem ipsum dolor sit, amet
            </p>
          </motion.div>

          {/* Phải: Title và Quote */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full text-left md:w-2/3 md:text-right"
          >
            <h3 className="text-secondary font-anton mb-4 text-xl tracking-wide uppercase md:text-4xl">
              L'{""} Ambiance
            </h3>
            <div className="flex justify-start md:justify-end">
              {/* Responsive Font: sans trên mobile, script trên desktop */}
              <p className="md:font-script text-primary max-w-3xl font-sans text-2xl leading-tight italic md:text-[55px] md:leading-[60px] md:not-italic">
                Không gian được tạo nên từ sự tinh giản, ấm cúng và cảm hứng
                đương đại
              </p>
            </div>
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
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={1.2}
            loop={true}
            speed={1000}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="!static h-[420px] sm:h-[500px] md:h-[650px]"
            /* !static để các nút absolute căn theo thẻ group ngoài cùng */
          >
            {AMBIENCE_DATA.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="group/item relative h-[543px] w-full overflow-hidden rounded-sm shadow-lg">
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
            className="text-primary absolute top-1/2 left-0 z-30 hidden h-12 w-12 -translate-x-6 -translate-y-1/2 items-center justify-center rounded-full bg-white opacity-0 shadow-2xl transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:bg-[#1A2542] hover:text-white md:left-4 md:flex"
          >
            <IoChevronBackOutline size={24} />
          </button>

          {/* Nút Next - Fix lỗi đẩy lề phải */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="text-primary absolute top-1/2 right-0 z-30 hidden h-12 w-12 translate-x-6 -translate-y-1/2 items-center justify-center rounded-full bg-white opacity-0 shadow-2xl transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:bg-[#1A2542] hover:text-white md:right-4 md:flex"
          >
            <IoChevronForwardOutline size={24} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AmbienceSection;
