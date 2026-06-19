import React from "react";
import { motion as Motion } from "framer-motion";

const ContinueStory = () => {
  return (
    <section className="relative mb-[120px] flex min-h-[85vh] items-center justify-center overflow-hidden bg-black py-20 md:py-28">
      {/* Cinematic Background Image (Blurred interior) */}
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ backgroundImage: "url('/images/about/boat2.png')" }}
      />

      {/* Dark overlays to ensure high contrast and readability */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1524]/90 via-transparent to-[#0F1524]/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      {/* Content Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center px-5 sm:px-8 md:px-12">
        <Motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="flex w-full flex-col items-center"
        >
          {/* Cursive text badge */}
          <span className="font-script text-secondary text-[40px] leading-none drop-shadow-[0_0_12px_rgba(207,178,110,0.4)] sm:text-[50px] md:text-[60px]">
            Viết tiếp
          </span>
          <h2 className="font-script mt-[-12px] text-[40px] leading-tight font-normal text-white drop-shadow-md sm:text-[50px] md:text-[60px]">
            Câu chuyện Bến Thuyền
          </h2>

          <h3 className="mt-6 mb-8 max-w-2xl text-center text-base font-bold tracking-wide text-white/95 md:text-lg">
            Hành trình của NS Bến Thuyền{" "}
            <span className="text-secondary font-sans">
              chưa bao giờ dừng lại!
            </span>
            .
          </h3>

          {/* Floating Glassmorphism Commitment Card */}
          <div className="relative flex w-full max-w-3xl flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 px-8 py-12 text-center shadow-[0_25px_60px_rgba(0,0,0,0.8)] md:px-16 md:py-16">
            {/* Subtle logo crest in background of card */}
            <div className="pointer-events-none absolute -right-10 -bottom-12 opacity-[0.03] select-none">
              <span className="text-secondary font-serif text-[200px] font-bold italic">
                NS
              </span>
            </div>

            {/* Quotation Marks decoration */}
            <span className="text-secondary/20 pointer-events-none absolute top-4 left-8 font-serif text-6xl select-none">
              “
            </span>
            <span className="text-secondary/20 pointer-events-none absolute right-8 bottom-4 font-serif text-6xl select-none">
              ”
            </span>

            <p className="max-w-2xl text-center text-sm leading-[1.8] font-normal text-gray-200/90 md:text-[16px]">
              Mỗi ngày trôi qua tại NS Bến Thuyền là một sự tiếp nối những giá
              trị di sản quý báu đã được vun đắp qua hơn sáu thập kỷ, tiếp nối
              niềm tin yêu vững chắc từ thực khách và tiếp nối khát vọng cháy
              bỏng nâng tầm trải nghiệm ẩm thực Việt. Chúng tôi cam kết không
              chỉ phục vụ những món ăn ngon từ hải sản tinh túy đại dương, mà sẽ
              luôn nỗ lực mang đến những khoảnh khắc sum họp đáng nhớ, biến mỗi
              cuộc gặp gỡ đều trở nên ý nghĩa và trọn vẹn nhất.
            </p>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default ContinueStory;
