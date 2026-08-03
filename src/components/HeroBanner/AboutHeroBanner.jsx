import React from "react";
import { motion } from "framer-motion";

const AboutHeroBanner = () => {
  return (
    <div className="relative h-[calc(100vh-72px)] md:h-[calc(100vh-112px)] w-full overflow-hidden bg-black">
      {/* Background Image & Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/about/bg.png')` }}
        />
        {/* Cinematic gradient overlay: Keeps center clear (via-black/25) for signboard visibility, soft dark at top/bottom for UI contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/10" />
      </motion.div>

      {/* Content - Centered */}
      <div className="relative z-10 container flex h-full flex-col items-center justify-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex w-full max-w-[1400px] flex-col items-center text-center"
        >
          {/* Soft ambient dark glow behind the text for perfect readability on bright photo */}
          <div className="pointer-events-none absolute z-[-1] h-[110px] w-[240px] rounded-full bg-black/65 blur-[35px] sm:h-[180px] sm:w-[400px] sm:blur-[60px] md:h-[260px] md:w-[580px] md:blur-[80px]" />

          {/* First Row: KHỞI */}
          <h1 className="font-serif text-[28px] leading-none font-semibold tracking-[0.15em] text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] select-none sm:text-[48px] md:text-[68px] lg:text-[80px]">
            KHỞI
          </h1>

          {/* Second Row: Layout Grid with NGUYÊN in center and taglines on the sides */}
          <div className="mt-3 grid w-full grid-cols-[1fr_auto_1fr] items-center gap-1.5 select-none sm:gap-2.5 md:gap-3 lg:gap-4">
            {/* Left text */}
            <div className="text-right">
              <span className="font-normalt font-sans text-[8px] tracking-[0.18em] whitespace-nowrap text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] sm:text-[10px] md:text-xs">
                Di Sản Từ 1955
              </span>
            </div>

            {/* Center word */}
            <div className="text-center">
              <span className="-mr-[0.15em] font-serif text-[28px] leading-none font-semibold tracking-[0.15em] text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] sm:text-[48px] md:text-[68px] lg:text-[80px]">
                NGUYÊN
              </span>
            </div>

            {/* Right text */}
            <div className="text-left">
              <span className="font-normalt font-sans text-[8px] tracking-[0.18em] whitespace-nowrap text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] sm:text-[10px] md:text-xs">
                Chắt Lọc Nên Giá Trị
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center space-y-2 select-none"
      >
        <span className="text-[11px] font-medium tracking-[0.25em] text-white/80 uppercase">
          Cuộn Xuống
        </span>
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/40 bg-black/10 p-1.5 backdrop-blur-xs">
          <motion.div
            animate={{
              y: [0, 14, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-secondary h-2.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(207,178,110,0.8)]"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default AboutHeroBanner;
