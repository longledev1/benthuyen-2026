import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { slides as defaultSlides } from "../../constants/slide-banner";
import { bannerService } from "../../services/bannerService";

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [activeSlides, setActiveSlides] = useState(defaultSlides);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await bannerService.fetchBanners();
        if (data && data.length > 0) {
          // Helper chuyển URL ảnh sang WebP nén nhẹ tự động
          const getOptimizedUrl = (url, isMobile = false) => {
            if (!url) return url;
            // Nếu là ảnh từ Supabase Storage, tận dụng image-delivery CDN nhẹ nhàng
            if (url.includes("supabase.co/storage/v1/object/public/")) {
              const width = isMobile ? 720 : 1280;
              return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=75`;
            }
            return url;
          };

          const formatted = data.map((b) => ({
            id: b.id,
            image: getOptimizedUrl(b.image_url, false),
            mobileImage: getOptimizedUrl(b.mobile_image_url, true),
            badge: "", // Canva banners are self-designed, keep text overlays empty
            title: "",
            description: "",
          }));
          setActiveSlides(formatted);
        }
      } catch (err) {
        console.error("Lỗi khi tải banner từ database:", err);
      }
    };

    loadBanners();
  }, []);

  const handlePrev = () => {
    if (activeSlides.length <= 1) return;
    setCurrent((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (activeSlides.length <= 1) return;
    setCurrent((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1));
  };

  // Nếu không có slide nào
  if (activeSlides.length === 0) return null;

  const currentSlide = activeSlides[current];
  const hasMobileImage = !!currentSlide?.mobileImage;

  return (
    <div className={`relative w-full overflow-hidden bg-white transition-all duration-500 ${
      hasMobileImage 
        ? "aspect-[9/16] h-auto md:aspect-[16/9] md:h-auto" 
        : "h-[320px] sm:h-[450px] md:aspect-[16/9] md:h-auto"
    }`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Background Image using picture tag for responsive layout */}
          <picture className="absolute inset-0 w-full h-full">
            {currentSlide.mobileImage && (
              <source media="(max-width: 767px)" srcSet={currentSlide.mobileImage} />
            )}
            <img
              src={currentSlide.image}
              alt={currentSlide.title || "Bến Thuyền Banner"}
              className="w-full h-full object-cover object-center"
              fetchpriority={current === 0 ? "high" : "auto"}
              loading={current === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </picture>
        </motion.div>
      </AnimatePresence>

      {/* Content (Render if any text is present in the slide) */}
      {(activeSlides[current].badge ||
        activeSlides[current].title ||
        activeSlides[current].description) && (
        <div className="relative z-10 container flex h-full flex-col justify-center">
          <motion.div
            key={`content-${current}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-3xl"
          >
            {activeSlides[current].badge && (
              <span className="bg-secondary mt-10 mb-6 inline-block rounded-[20px] p-5 text-[24px] font-bold tracking-widest text-white shadow-lg">
                {activeSlides[current].badge}
              </span>
            )}
            {activeSlides[current].title && (
              <h1 className="mb-6 font-serif text-4xl leading-tight whitespace-pre-line text-white italic md:text-[55px]">
                {activeSlides[current].title}
              </h1>
            )}
            {activeSlides[current].description && (
              <p className="font-normalt max-w-xl text-sm leading-relaxed text-gray-200">
                {activeSlides[current].description}
              </p>
            )}
          </motion.div>
        </div>
      )}

      {/* Chỉ hiển thị các nút điều chuyển slide nếu có từ 2 slide trở lên */}
      {activeSlides.length > 1 && (
        <>
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/30 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:text-slate-900 active:scale-95 md:left-8 md:h-12 md:w-12"
            aria-label="Previous Slide"
          >
            <FiChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-4 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/30 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:text-slate-900 active:scale-95 md:right-8 md:h-12 md:w-12"
            aria-label="Next Slide"
          >
            <FiChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default HeroBanner;
