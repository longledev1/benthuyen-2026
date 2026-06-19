import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import LazyImage from "./LazyImage";

export const NewsCollageSection = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      {/* Collage & Card Content - Block 1 */}
      <div className="mb-28 grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-0">
        {/* Collage Grid (Left - 7 cols) */}
        <div className="z-10 flex w-full flex-col gap-2 md:gap-3 lg:col-span-7">
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <div className="h-[180px] overflow-hidden rounded-sm shadow-md sm:h-[220px] md:h-[300px]">
              <LazyImage
                src="/images/news/event1.webp"
                alt="Không gian 1"
                className="cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                onClick={() => setSelectedImage("/images/news/event1.webp")}
              />
            </div>
            <div className="h-[180px] overflow-hidden rounded-sm shadow-md sm:h-[220px] md:h-[300px]">
              <LazyImage
                src="/images/news/event2.webp"
                alt="Bàn tiệc"
                className="cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                onClick={() => setSelectedImage("/images/news/event2.webp")}
              />
            </div>
            <div className="h-[180px] overflow-hidden rounded-sm shadow-md sm:h-[220px] md:h-[300px]">
              <LazyImage
                src="/images/news/event3.webp"
                alt="Hải sản"
                className="cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                onClick={() => setSelectedImage("/images/news/event3.webp")}
              />
            </div>
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div className="h-[120px] overflow-hidden rounded-sm shadow-md sm:h-[160px] md:h-[220px]">
              <LazyImage
                src="/images/news/event4.webp"
                alt="Ban công"
                className="cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                onClick={() => setSelectedImage("/images/news/event4.webp")}
              />
            </div>
            <div className="h-[120px] overflow-hidden rounded-sm shadow-md sm:h-[160px] md:h-[220px]">
              <LazyImage
                src="/images/news/event5.webp"
                alt="Ấm cúng"
                className="cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                onClick={() => setSelectedImage("/images/news/event5.webp")}
              />
            </div>
          </div>
          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div className="h-[120px] overflow-hidden rounded-sm shadow-md sm:h-[160px] md:h-[220px]">
              <LazyImage
                src="/images/news/event6.webp"
                alt="Phòng VIP"
                className="object-cover transition-transform duration-700 hover:scale-105"
                onClick={() => setSelectedImage("/images/news/event6.webp")}
              />
            </div>
            <div className="h-[120px] overflow-hidden rounded-sm shadow-md sm:h-[160px] md:h-[220px]">
              <LazyImage
                src="/images/news/event7.webp"
                alt="Lối vào"
                className="cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                onClick={() => setSelectedImage("/images/news/event7.webp")}
              />
            </div>
          </div>
        </div>

        {/* White Floating Card (Right - 5 cols) */}
        <div className="z-20 w-full lg:col-span-5 lg:-ml-12 lg:pl-4">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="border-secondary relative flex min-h-[400px] flex-col justify-between rounded-sm border-t-[6px] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.12)] md:p-12 lg:h-[530px]"
          >
            <div>
              <span className="text-primary mb-1 block font-sans text-[11px] font-medium tracking-[0.25em] uppercase">
                Mỗi Sự Kiện
              </span>
              <h3 className="text-primary mb-8 font-serif text-2xl leading-snug font-bold tracking-wide uppercase md:text-3xl">
                Một Dấu Ấn Riêng
              </h3>

              <div className="font-normalt space-y-4 text-justify font-sans text-xs leading-relaxed text-gray-500 sm:text-sm">
                <p>
                  Tại Bến Thuyền, mỗi sự kiện không chỉ là một buổi tiệc, mà là
                  một hành trình được kiến tạo riêng biệt. Từ việc lựa chọn
                  không gian, sắp đặt ánh sáng, đến tinh hoa ẩm thực được chắt
                  lọc từ những nguyên liệu tươi ngon của biển cả, mọi chi tiết
                  đều được chăm chút để tạo nên một trải nghiệm trọn vẹn. Chúng
                  tôi tin rằng, chính những khoảnh khắc được nâng niu ấy sẽ trở
                  thành dấu ấn riêng, đọng lại trong từng vị giác, từng cảm xúc
                  và trong ký ức của mỗi khách mời.
                </p>
                <p>
                  Chúng tôi tin rằng, chính những khoảnh khắc được nâng niu ấy
                  sẽ trở thành dấu ấn riêng, đọng lại trong từng vị giác, từng
                  cảm xúc và trong ký ức của mỗi khách mời.
                </p>
              </div>
            </div>

            {/* Chữ ký bottom right */}
            <div className="mt-8 flex justify-end">
              <span className="font-script text-secondary text-3xl tracking-wide select-none">
                Thuyền trưởng
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Collage & Card Content - Block 2 (Reverse) */}
      <div className="mb-28 grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-0">
        {/* Blue Floating Card (Left - 5 cols) */}
        <div className="relative z-20 order-1 w-full lg:col-span-5 lg:w-[calc(100%+3rem)] lg:max-w-none lg:pr-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-primary-gradient border-secondary relative flex min-h-[400px] flex-col justify-between rounded-sm border-t-[6px] p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] md:p-12 lg:h-[530px]"
          >
            <div>
              <span className="text-secondary mb-1 block font-sans text-[11px] font-medium tracking-[0.25em] uppercase">
                Những Khoảnh Khắc Nổi Bật
              </span>
              <h3 className="mb-8 font-serif text-2xl leading-snug font-bold tracking-wide text-white uppercase md:text-3xl">
                Được Ghi Lại Trọn Vẹn
              </h3>

              <div className="font-normalt space-y-4 text-justify font-sans text-xs leading-relaxed text-slate-200 sm:text-sm">
                <p>
                  Mỗi sự kiện tại Bến Thuyền đều mang theo những câu chuyện
                  riêng, được tạo nên từ tiếng cười, những lời chúc ý nghĩa và
                  những khoảnh khắc đáng nhớ bên người thân, bạn bè hay đối tác.
                  Qua từng hình ảnh và bài viết, chúng tôi lưu giữ những dấu ấn
                  đặc biệt ấy như một cách kể lại hành trình của những buổi tiệc
                  đã diễn ra.
                </p>
                <p>
                  Từ các buổi gặp gỡ thân mật đến những sự kiện quy mô lớn, mỗi
                  khoảnh khắc đều phản ánh sự chỉn chu trong công tác tổ chức,
                  sự tinh tế trong không gian và những trải nghiệm ẩm thực được
                  khách mời yêu mến. Đây không chỉ là nơi cập nhật tin tức và sự
                  kiện, mà còn là nơi lưu giữ những kỷ niệm đẹp đã được viết nên
                  tại Bến Thuyền.
                </p>
              </div>
            </div>

            {/* Chữ ký bottom right */}
            <div className="mt-8 flex justify-end">
              <span className="font-script text-3xl tracking-wide select-none">
                Bếp trưởng
              </span>
            </div>
          </motion.div>
        </div>

        {/* Collage Grid (Right - 7 cols) */}
        <div className="relative z-10 order-2 flex w-full flex-col gap-2 md:gap-3 lg:col-span-7">
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <div className="h-[180px] overflow-hidden rounded-sm shadow-md sm:h-[220px] md:h-[300px]">
              <LazyImage
                src="/images/news/event8.webp"
                alt="Món ăn 1"
                className="cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                onClick={() => setSelectedImage("/images/news/event8.webp")}
              />
            </div>
            <div className="h-[180px] overflow-hidden rounded-sm shadow-md sm:h-[220px] md:h-[300px]">
              <LazyImage
                src="/images/news/event9.webp"
                alt="Hải sản tươi"
                className="cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                onClick={() => setSelectedImage("/images/news/event9.webp")}
              />
            </div>
            <div className="h-[180px] overflow-hidden rounded-sm shadow-md sm:h-[220px] md:h-[300px]">
              <LazyImage
                src="/images/news/event10.webp"
                alt="Bàn tiệc VIP"
                className="cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                onClick={() => setSelectedImage("/images/news/event10.webp")}
              />
            </div>
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div className="h-[120px] overflow-hidden rounded-sm shadow-md sm:h-[160px] md:h-[220px]">
              <LazyImage
                src="/images/news/event11.webp"
                alt="Phục vụ"
                className="cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                onClick={() => setSelectedImage("/images/news/event11.webp")}
              />
            </div>
            <div className="h-[120px] overflow-hidden rounded-sm shadow-md sm:h-[160px] md:h-[220px]">
              <LazyImage
                src="/images/news/event12.webp"
                alt="Không gian nhà hàng"
                className="cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                onClick={() => setSelectedImage("/images/news/event12.webp")}
              />
            </div>
          </div>
          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div className="h-[120px] overflow-hidden rounded-sm shadow-md sm:h-[160px] md:h-[220px]">
              <LazyImage
                src="/images/news/event13.webp"
                alt="Không gian ban đêm"
                className="cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                onClick={() => setSelectedImage("/images/news/event13.webp")}
              />
            </div>
            <div className="h-[120px] overflow-hidden rounded-sm shadow-md sm:h-[160px] md:h-[220px]">
              <LazyImage
                src="/images/news/event14.webp"
                alt="Phòng tiệc sang trọng"
                className="cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
                onClick={() => setSelectedImage("/images/news/event14.webp")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal để phóng to hình ảnh */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 select-none md:p-8">
            {/* Backdrop làm mờ màn hình */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 cursor-pointer bg-black/90 backdrop-blur-md"
            />

            {/* Nút đóng Lightbox */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 z-[10001] cursor-pointer rounded-full bg-white/10 p-3 text-white/70 shadow-lg transition-all duration-300 hover:bg-white/20 hover:text-white"
              aria-label="Đóng ảnh"
            >
              <FiX size={24} />
            </button>

            {/* Khung hiển thị ảnh lớn */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
              className="relative z-[10001] flex max-h-[90vh] max-w-full items-center justify-center overflow-hidden rounded-md shadow-2xl"
            >
              <img
                src={selectedImage}
                alt="Phóng to chi tiết"
                className="max-h-[85vh] max-w-[95vw] rounded-sm border border-white/10 object-contain shadow-inner"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewsCollageSection;
