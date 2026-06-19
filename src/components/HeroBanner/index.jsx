import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slides } from "../../constants/slide-banner";

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Background Image & Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container flex h-full flex-col justify-center">
        <motion.div
          key={`content-${current}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-3xl"
        >
          <span className="bg-secondary mt-10 mb-6 inline-block rounded-[20px] p-5 text-[24px] font-bold tracking-widest text-white shadow-lg">
            {slides[current].badge}
          </span>
          <h1 className="mb-6 font-serif text-4xl leading-tight whitespace-pre-line text-white italic md:text-[55px]">
            {slides[current].title}
          </h1>
          <p className="font-normalt max-w-xl text-sm leading-relaxed text-gray-200">
            {slides[current].description}
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 space-x-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="group py-4 focus:outline-none"
          >
            <div
              className={`h-[2px] transition-all duration-500 ${current === index ? "bg-secondary w-24" : "w-12 bg-white group-hover:bg-white"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
