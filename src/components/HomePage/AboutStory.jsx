import React from "react";
import { motion } from "framer-motion";

import LazyImage from "../LazyImage";
import EdgeDecorator from "../EdgeDecorator";

const AboutStory = () => {
  return (
    <section className="relative w-full overflow-hidden py-12 md:py-20">
      {/* Lá cọ trang trí ở góc trên bên trái sát mép màn hình */}

      <div className="container mx-auto px-4 md:px-0">
        {/* 1. Phần Line và Header */}
        <div className="relative mb-8 grid grid-cols-12 gap-4 md:mb-12 md:gap-8">
          {/* Đường gạch xanh bên trái - Mobile: Chiếm trọn hoặc linh hoạt hơn */}
          <div className="col-span-12 md:col-span-3">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ originX: 0 }}
              className="mb-4 h-[1px] w-full bg-[#1A2542] opacity-30 md:opacity-100"
            ></motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-anton text-secondary text-xs tracking-wide uppercase md:text-[20px]"
            >
              Notre Histoire
            </motion.h2>
          </div>

          {/* Đường gạch xanh bên phải, Quote và Boat */}
          <div className="relative col-span-12 md:col-span-9">
            {/* Ẩn gạch ngang này trên mobile nếu thấy quá rối, hoặc giữ lại */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ originX: 0 }}
              className="mb-4 hidden h-[1px] w-full bg-[#1A2542] md:block"
            ></motion.div>
            <div className="flex items-start justify-between">
              {/* - Font: font-sans trên mobile, font-script từ md trở lên 
                - Size: text-3xl trên mobile, text-[50px] trên desktop
            */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="md:font-script text-primary font-sans text-2xl leading-tight italic md:text-[55px] md:leading-[60px] md:not-italic"
              >
                Hành trình ẩm thực kết tinh từ đam mê,{" "}
                <br className="hidden md:block" /> sự chỉn chu và lòng hiếu
                khách.
              </motion.p>

              {/* Ảnh chiếc thuyền */}
              <motion.div
                initial={{ opacity: 0, x: 50, y: -20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                className="absolute -top-20 right-[-40px] z-10 hidden w-48 md:-top-30 md:right-[-60px] md:w-64 lg:block"
              >
                <motion.img
                  src="/images/home/boat.webp"
                  alt="Boat Illustration"
                  width="256"
                  height="370"
                  className="w-full opacity-80"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 1, -1, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* 2. Phần Content chính (Ảnh và Text) */}
        <div className="mt-12 grid grid-cols-1 items-center gap-8 md:mt-20 md:grid-cols-2 md:gap-22">
          {/* Ảnh lớn bên trái */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="aspect-[4/3] w-full overflow-hidden rounded-sm shadow-sm"
          >
            <LazyImage
              src="/images/banner/banner1.webp"
              alt="Restaurant Experience"
              className="grayscale-[20%] transition-all duration-1000 hover:grayscale-0"
            />
          </motion.div>

          {/* Nội dung text bên phải */}
          {/* Mobile: Căn lề trái/đều để dễ đọc hơn, Desktop: Căn phải theo code cũ */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col space-y-6 text-left md:space-y-10 md:text-right"
          >
            <div className="space-y-6 md:space-y-8">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-sm leading-relaxed font-normal text-gray-600 md:text-base"
              >
                <span className="text-primary font-bold">Bến Thuyền</span> – Nơi
                ẩm thực, không gian và cảm xúc hòa quyện. Lấy cảm hứng từ nhịp
                sống yên bình bên bến cảng, mỗi góc nhỏ tại đây được chăm chút
                kỹ lưỡng và đồng thời thiết lập một không gian thư thái, gần gũi
                nhưng không kém phần sang trọng.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-sm leading-relaxed font-normal text-gray-600 md:text-base"
              >
                Từ hương vị món ăn, cách bày trí cho đến sự tận tâm trong phục
                vụ, tất cả đều đồng nhất nhằm đảm bảo một trải nghiệm trọn vẹn
                nhất cho Quý khách.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Sao biển vàng trang trí ở góc dưới bên phải sát mép màn hình */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="pointer-events-none absolute top-[500px] right-0 z-10 mr-[-60px] hidden select-none md:block"
      >
        <img
          src="/images/decorations/sanho.webp"
          className="animate-float-slow w-[300px] opacity-70"
          alt="Starfish Decoration"
          width="300"
          height="450"
          loading="lazy"
        />
      </motion.div>
    </section>
  );
};

export default AboutStory;
