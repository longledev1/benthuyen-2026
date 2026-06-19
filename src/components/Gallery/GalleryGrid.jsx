import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoClose,
  IoChevronBack,
  IoChevronForward,
  IoArrowBackOutline,
} from "react-icons/io5"; // Import lại icon mũi tên
import LazyImage from "../LazyImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Sử dụng Navigation thay vì Pagination
import "swiper/css";
import "swiper/css/navigation"; // Import lại css navigation
import { galleryService } from "../../services/galleryService";

const GalleryGrid = ({ category, onBack }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [chunkSize, setChunkSize] = useState(8);

  // Tải dữ liệu thực tế từ Supabase
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        const categoryKey = category.id || category.slug;
        const dbImages =
          await galleryService.fetchGalleryByCategory(categoryKey);

        if (dbImages.length > 0) {
          setImages(dbImages);
        } else {
          const formattedMock = (category.images || []).map((img) => ({
            ...img,
            description: "", // Bỏ description theo yêu cầu
          }));
          setImages(formattedMock);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu Gallery từ Supabase:", err);
        const formattedMock = (category.images || []).map((img) => ({
          ...img,
          description: "",
        }));
        setImages(formattedMock);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [category]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setChunkSize(4); // Mobile dọc: 4 ảnh/slide
      } else if (width < 1024) {
        setChunkSize(6); // Tablet: 6 ảnh/slide
      } else {
        setChunkSize(8); // Desktop: 8 ảnh/slide
      }
    };

    handleResize(); // Chạy lần đầu
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Xử lý phím tắt bàn phím khi mở Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeImageIndex === null) return;
      if (e.key === "Escape") setActiveImageIndex(null);
      if (e.key === "ArrowRight") handleLightboxNext();
      if (e.key === "ArrowLeft") handleLightboxPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex]);

  // Các hàm điều hướng riêng cho Lightbox
  const handleLightboxNext = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handleLightboxPrev = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  // Hiệu ứng container chứa các phần tử lưới (staggered fade-in)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Hiệu ứng cho từng card ảnh
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 18,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-white">
        <div className="border-secondary h-10 w-10 animate-spin rounded-full border-t-2 border-r-2 border-transparent"></div>
        <p className="font-normalt mt-4 text-xs tracking-[0.2em] text-gray-400 uppercase">
          Đang tải hình ảnh...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-9 flex min-h-screen w-full flex-col items-center px-4 pt-28 pb-24 text-white sm:px-6 md:px-8 lg:px-12">
      {/* Back Button & Title Area */}
      <div className="container mb-12 flex w-full flex-col items-start">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onBack}
          className="group font-normalt text-secondary mb-8 flex cursor-pointer items-center space-x-2 text-sm tracking-[0.2em] uppercase transition-colors duration-300 hover:underline sm:text-base md:text-lg"
        >
          <IoArrowBackOutline className="text-lg transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Quay lại</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-3xl"
        >
          <h2 className="text-primary font-hand mb-4 text-3xl font-normal tracking-wide sm:text-4xl md:text-5xl">
            {category?.mainTitle} {category.subTitle}
          </h2>
          <div className="bg-secondary mb-4 h-[2px] w-20" />
          <p className="font-sans text-sm leading-relaxed font-normal text-black sm:text-base">
            {category?.desc}
          </p>
        </motion.div>
      </div>

      {/* Gallery Swiper Container với khối đệm bao ngoài an toàn cho 2 nút bấm */}
      <div className="gallery-swiper relative container w-full px-12 sm:px-16">
        <Swiper
          key={chunkSize}
          modules={[Navigation]} // Đã đổi module sang Navigation
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          spaceBetween={30}
          slidesPerView={1}
          onSwiper={setSwiperInstance}
          className="w-full"
        >
          {(() => {
            const chunkedImages = [];
            for (let i = 0; i < images.length; i += chunkSize) {
              chunkedImages.push(images.slice(i, i + chunkSize));
            }

            return chunkedImages.map((chunk, slideIndex) => (
              <SwiperSlide key={`${chunkSize}-${slideIndex}`} className="py-2">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
                >
                  {chunk.map((image, indexInChunk) => {
                    const globalIndex = slideIndex * chunkSize + indexInChunk;
                    return (
                      <motion.div
                        key={globalIndex}
                        variants={itemVariants}
                        onClick={() => setActiveImageIndex(globalIndex)}
                        className="group relative aspect-4/3 cursor-pointer overflow-hidden rounded-xl border border-white/5 transition-all duration-500 hover:shadow-2xl"
                      >
                        {/* Image */}
                        <div className="h-full w-full overflow-hidden">
                          <LazyImage
                            src={image.src}
                            alt={image.title}
                            className="object-cover brightness-[0.9] transition-transform duration-700 ease-out group-hover:scale-110 group-hover:brightness-100"
                          />
                        </div>

                        {/* Gradient Overlay for Text */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

                        {/* Content overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end p-5">
                          <h3 className="translate-y-2 font-serif text-base leading-snug font-normal text-white transition-transform duration-300 group-hover:translate-y-0 sm:text-lg">
                            {image.title}
                          </h3>
                        </div>

                        {/* Golden Frame Border on hover */}
                        <div className="border-secondary/0 group-hover:border-secondary/35 pointer-events-none absolute inset-0 scale-[0.98] rounded-xl border transition-all duration-500 group-hover:scale-100" />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </SwiperSlide>
            ));
          })()}
        </Swiper>

        {/* Nút Previous ở lề TRÁI hình ảnh (Tự động mờ 20% khi hết ảnh) */}
        <button className="swiper-button-prev-custom hover:border-secondary hover:bg-secondary absolute top-[50%] left-0 z-30 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/80 text-xl text-white transition-all duration-300 hover:text-black disabled:pointer-events-none disabled:opacity-20 sm:left-2 [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-20">
          <IoChevronBack />
        </button>

        {/* Nút Next ở lề PHẢI hình ảnh (Tự động mờ 20% khi hết ảnh) */}
        <button className="swiper-button-next-custom hover:border-secondary hover:bg-secondary absolute top-[50%] right-0 z-30 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/80 text-xl text-white transition-all duration-300 hover:text-black disabled:pointer-events-none disabled:opacity-20 sm:right-2 [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-20">
          <IoChevronForward />
        </button>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md select-none"
          >
            {/* Top Bar (Title & Close Button) */}
            <div className="absolute inset-x-0 top-0 z-10 flex h-20 items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-6 sm:px-10">
              <div className="flex flex-col">
                <span className="text-secondary text-[10px] font-semibold tracking-[0.25em] uppercase">
                  {category.title}
                </span>
                <span className="font-normalt mt-1 max-w-[280px] truncate text-sm text-gray-300 sm:max-w-lg md:max-w-2xl">
                  {images[activeImageIndex].title}
                </span>
              </div>

              <button
                onClick={() => setActiveImageIndex(null)}
                className="hover:border-secondary/50 hover:text-secondary flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl text-white transition-all duration-300 hover:bg-white/10"
              >
                <IoClose />
              </button>
            </div>

            {/* Center Area (Image & Lightbox Nav) */}
            <div className="relative flex aspect-video w-full max-w-5xl items-center justify-center px-4 sm:px-12 md:aspect-16/10">
              <button
                onClick={handleLightboxPrev}
                className="hover:border-secondary hover:bg-secondary absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-black/40 text-2xl text-white transition-all duration-300 hover:text-black sm:left-6"
              >
                <IoChevronBack />
              </button>

              {/* Displayed Image */}
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex h-full max-h-[75vh] w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/20"
              >
                <LazyImage
                  src={images[activeImageIndex].src}
                  alt={images[activeImageIndex].title}
                  className="max-h-full max-w-full object-contain select-none"
                  containerClassName="bg-transparent"
                />
              </motion.div>

              <button
                onClick={handleLightboxNext}
                className="hover:border-secondary hover:bg-secondary absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-black/40 text-2xl text-white transition-all duration-300 hover:text-black sm:right-6"
              >
                <IoChevronForward />
              </button>
            </div>

            {/* Bottom Caption & Counter */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-between gap-3 bg-gradient-to-t from-black/80 to-transparent px-6 py-6 sm:flex-row sm:px-10">
              {images[activeImageIndex].description && (
                <p className="font-normalt max-w-2xl text-center text-xs text-gray-300 sm:text-left sm:text-sm">
                  {images[activeImageIndex].description}
                </p>
              )}

              <span className="text-secondary ml-auto rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-sans text-xs tracking-widest">
                {activeImageIndex + 1} / {images.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryGrid;
