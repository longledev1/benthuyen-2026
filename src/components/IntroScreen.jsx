import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IntroScreen = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Thời gian hiển thị logo trước khi bắt đầu fade out (2.8 giây)
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2800);

    // Thời gian kết thúc hoàn toàn (3.6 giây) để unmount
    const endTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ background: "linear-gradient(135deg, #254a5f 0%, #122530 100%)" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between py-16 px-6 overflow-hidden"
        >
          {/* Subtle Ambient Light Glow in Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)] pointer-events-none" />

          {/* Top Spacer to balance the layout */}
          <div className="h-10" />

          {/* Center Logo with Luxury Shimmer / Scale */}
          <div className="relative flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 1.6,
                ease: [0.16, 1, 0.3, 1] // Custom luxury ease-out
              }}
              className="relative z-10 w-60 sm:w-80"
            >
              {/* Base Logo Image */}
              <img
                src="/logo/nsbenthuyen_white.png"
                alt="NS Bến Thuyền Logo"
                className="w-full h-auto object-contain select-none"
              />

              {/* Stationary Masked Container */}
              <div 
                style={{
                  WebkitMaskImage: "url('/logo/nsbenthuyen_white.png')",
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskImage: "url('/logo/nsbenthuyen_white.png')",
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center"
                }}
                className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
              >
                {/* Moving Sheen Line inside the stationary mask */}
                <motion.div
                  initial={{ x: "-150%" }}
                  animate={{ x: "150%" }}
                  transition={{
                    duration: 1.8,
                    delay: 0.5,
                    ease: "easeInOut"
                  }}
                  style={{
                    background: "linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.05) 30%, rgba(255, 255, 255, 0.75) 50%, rgba(255, 255, 255, 0.05) 70%, transparent 80%)",
                  }}
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </motion.div>

            {/* Micro-loading Line below logo */}
            <div className="relative mt-8 h-[1px] w-32 overflow-hidden bg-white/10">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{
                  duration: 2.2,
                  delay: 0.2,
                  ease: "easeInOut"
                }}
                className="absolute top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-[#cfb26e] to-transparent"
              />
            </div>
          </div>

          {/* Bottom Watermark: A MEMBER OF NS GROUP */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 1.2,
              ease: "easeOut"
            }}
            className="z-10 select-none"
          >
            <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.25em] text-white/50 font-normal uppercase">
              A MEMBER OF <span className="font-semibold text-white/70">NS GROUP</span>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;
