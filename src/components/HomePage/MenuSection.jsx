import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LazyImage from "../LazyImage";

const MenuSection = () => {
  const [showModal, setShowModal] = useState(false);

  const IconChevronRight = ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );

  const IconX = ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );

  return (
    <section className="overflow-hidden bg-white pt-10 pb-10 md:pt-24 md:pb-16">
      <div className="container mx-auto grid grid-cols-1 items-center gap-10 px-6 md:grid-cols-12 md:gap-16">
        {/* BÊN TRÁI: Tiêu đề & Nút bấm */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative md:col-span-5 flex flex-col items-center text-center md:items-start md:text-left justify-center space-y-5 md:space-y-8 z-10"
        >
          <div>
            <h3 className="text-secondary font-anton mb-2 text-2xl tracking-widest uppercase md:mb-4 md:text-4xl">
              A LÀ CARTE
            </h3>
            <h2 className="text-primary font-kanit md:font-script text-xl sm:text-2xl md:text-[52px] font-light md:font-normal leading-relaxed md:leading-[60px] pb-1">
              Những món ăn được chắt lọc từ tinh hoa nguyên liệu và nghệ thuật <span className="whitespace-nowrap">chế biến</span>
            </h2>
          </div>

          <div className="relative z-10 pt-1 md:pt-2 w-full flex justify-center md:justify-start">
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-white flex items-center justify-center space-x-3 rounded-full px-8 py-3.5 text-xs font-bold uppercase shadow-lg transition-all duration-300 hover:opacity-90 hover:shadow-xl active:scale-95 cursor-pointer w-fit"
            >
              <span className="tracking-[0.2em] mr-[-0.2em]">Xem Thực Đơn</span>
              <IconChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* BÊN PHẢI: Hình ảnh Menu và Nút bấm */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="group/menu relative md:col-span-7 flex justify-center md:justify-end w-full"
        >
          {/* Wrapper giới hạn kích thước thực tế của Menu để không bị quá to */}
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] p-2">
            {/* Elegant double border background decoration */}
            <div className="absolute inset-0 border border-secondary/30 rounded-2xl transform translate-x-2 translate-y-2 md:translate-x-3 md:translate-y-3 -z-10 group-hover/menu:translate-x-1 group-hover/menu:translate-y-1 transition-transform duration-500" />
            
            {/* Ảnh Menu (Clickable) */}
            <div 
              onClick={() => setShowModal(true)}
              className="relative overflow-hidden rounded-2xl shadow-2xl bg-white border border-slate-100 cursor-pointer"
            >
              <LazyImage
                src="/images/home/menualacarte.png"
                alt="Menu Food"
                containerClassName="h-[370px] sm:h-[430px] md:h-[520px] w-full"
                className="object-cover transition-transform duration-1000 group-hover/menu:scale-105"
              />
              
              {/* Hover overlay for premium action indicator */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/menu:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                <span className="bg-white/95 text-primary border border-secondary/20 rounded-full px-5 py-2 text-[10px] font-bold tracking-[0.2em] uppercase shadow-lg transform translate-y-2 group-hover/menu:translate-y-0 transition-transform duration-300">
                  Xem Menu
                </span>
              </div>
            </div>

            {/* Nút bấm Popup */}
            <button
              onClick={() => setShowModal(true)}
              className="absolute top-1/2 -right-4 z-20 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow-xl transition-all duration-300 hover:bg-[#1A2542] hover:text-white"
            >
              <IconChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Elegant Gold Divider */}
      <div className="container mx-auto px-6 pt-10 pb-2 flex items-center justify-center select-none">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent flex-1" />
        <div className="mx-4 flex items-center justify-center">
          <svg className="w-5 h-5 text-secondary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L15 8H9L12 2Z" fill="currentColor"/>
            <path d="M12 22L9 16H15L12 22Z" fill="currentColor"/>
            <circle cx="12" cy="12" r="2.2" fill="currentColor"/>
          </svg>
        </div>
        <div className="h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent flex-1" />
      </div>

      {/* POPUP THÔNG BÁO */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Lớp phủ Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-[#1A2542]/40 backdrop-blur-md"
            />

            {/* Nội dung Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="border-secondary relative z-[101] w-full max-w-md rounded-sm border-t-[6px] bg-white p-10 text-center shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="hover:text-primary absolute top-4 right-4 text-gray-400 transition-colors"
              >
                <IconX className="h-6 w-6" />
              </button>

              <div className="mb-8">
                <h3 className="text-primary mb-4 font-serif text-2xl tracking-widest uppercase">
                  Thông báo
                </h3>
                <p className="font-normalt leading-relaxed text-gray-500">
                  Thực đơn mới hiện đang được chúng tôi cập nhật để mang lại
                  trải nghiệm tốt nhất cho quý khách.
                  <br />
                  <br />
                  NS Bến Thuyền sẽ cố gắng hoàn thiện trong thời gian nhanh nhất
                  để đăng tải lên website.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="bg-primary w-full cursor-pointer rounded-sm py-4 text-[11px] font-bold tracking-[0.3em] text-white uppercase shadow-lg transition-all hover:opacity-90 active:scale-95"
              >
                Đồng ý
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MenuSection;
