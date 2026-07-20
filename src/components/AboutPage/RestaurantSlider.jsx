import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import LazyImage from "../LazyImage";
import { RESTAURANT_SLIDES } from "../../constants/restaurant-slides";

const RestaurantSlider = () => {
    // Dữ liệu ảnh cấu hình theo tỷ lệ ngang/dọc/ngang/dọc
    const slides = RESTAURANT_SLIDES;
    const [activeIndex, setActiveIndex] = useState(null); // null = đóng lightbox

    // 3. Khai báo state để lưu trữ element của 2 nút bấm
    const [prevBtn, setPrevBtn] = useState(null);
    const [nextBtn, setNextBtn] = useState(null);

    const openLightbox = (index) => setActiveIndex(index);
    const closeLightbox = () => setActiveIndex(null);

    const goPrev = () => {
        setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const goNext = () => {
        setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        if (activeIndex === null) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex]);

    return (
        // 4. Sửa thẻ bọc ngoài thành flex-col và min-h-screen để xếp dọc Slider và Nút
        <div className="pt-4 pb-12 sm:pt-6 sm:pb-16 md:pt-8 md:pb-20 lg:pt-10 lg:pb-24 flex w-full flex-col items-center justify-center overflow-hidden">
            {/* KHI VỰC SLIDER */}
            <div className="w-full">
                <Swiper
                    modules={[Navigation]} // 5. Khai báo module Navigation
                    navigation={{
                        prevEl: prevBtn, // 6. Truyền state prevBtn vào
                        nextEl: nextBtn, // 7. Truyền state nextBtn vào
                    }}
                    slidesPerView={"auto"} // Cho phép width slide tuỳ biến
                    spaceBetween={40} // Khoảng cách giữa các ảnh (gap)
                    grabCursor={true} // Hiện con trỏ bàn tay khi kéo
                    // TRICK TAILWIND: Ép thẻ con .swiper-wrapper căn giữa (align-items: center)
                    className="w-full px-10 [&>.swiper-wrapper]:items-center"
                >
                    {slides.map((slide, idx) => (
                        <SwiperSlide
                            key={slide.id}
                            // Bắt buộc dùng !w-auto để SwiperSlide không bị ép width mặc định
                            className="!w-auto"
                        >
                            <div className="overflow-hidden shadow-sm">
                                <LazyImage
                                    onClick={() => openLightbox(idx)}
                                    src={slide.src}
                                    alt={`Slide ${slide.id}`}
                                    containerClassName={slide.imgClass}
                                    className="cursor-pointer object-cover transition-transform duration-700 ease-in-out hover:scale-[1.03]"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* KHU VỰC NÚT ĐIỀU HƯỚNG BÊN DƯỚI */}
            <div className="mt-12 flex items-center justify-center gap-6">
                {/* Nút Prev */}
                <button
                    ref={setPrevBtn} // 8. Gắn ref vào đây để bắt element
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-[#3d3832] text-[#3d3832] transition-all hover:bg-[#3d3832] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                </button>

                {/* Nút Next */}
                <button
                    ref={setNextBtn} // 9. Gắn ref vào đây để bắt element
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-[#3d3832] text-[#3d3832] transition-all hover:bg-[#3d3832] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </button>
            </div>

            {/* LIGHTBOX */}
            {activeIndex !== null && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={closeLightbox}
                >
                    {/* Close */}
                    <button
                        className="absolute top-4 right-4 text-4xl text-white hover:opacity-70 md:top-6 md:right-6"
                        onClick={closeLightbox}
                        aria-label="Close"
                    >
                        ×
                    </button>

                    {/* Prev */}
                    <button
                        className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20 md:left-4 md:px-4 md:py-3"
                        onClick={(e) => {
                            e.stopPropagation();
                            goPrev();
                        }}
                        aria-label="Previous"
                    >
                        ←
                    </button>

                    {/* Next */}
                    <button
                        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20 md:right-4 md:px-4 md:py-3"
                        onClick={(e) => {
                            e.stopPropagation();
                            goNext();
                        }}
                        aria-label="Next"
                    >
                        →
                    </button>

                    {/* Image Container */}
                    <div
                        className="w-full max-w-5xl px-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={slides[activeIndex].src}
                            alt=""
                            className="max-h-[80vh] w-full rounded-lg object-contain"
                        />
                        {slides[activeIndex].caption ? (
                            <p className="mt-4 text-center text-sm font-semibold text-white md:text-base">
                                {slides[activeIndex].caption}
                            </p>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantSlider;
