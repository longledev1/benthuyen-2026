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
    <section className="overflow-hidden bg-white">
      <div className="container mx-auto grid grid-cols-1 items-center gap-16 px-6 md:grid-cols-2">
        {/* BÊN TRÁI: Nội dung văn bản */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col space-y-8"
        >
          <div>
            <h3 className="text-secondary font-anton mb-4 text-xl tracking-wide uppercase md:text-4xl">
              A LÀ CARTE
            </h3>
            <div className="flex justify-start md:justify-end">
              {/* Responsive Font: sans trên mobile, script trên desktop */}
              <p className="md:font-script text-primary max-w-3xl font-sans text-2xl leading-tight italic md:text-[55px] md:leading-[60px] md:not-italic">
                Những món ăn được chắt lọc từ tinh hoa nguyên liệu và nghệ thuật
                chế biến
              </p>
            </div>
          </div>

          <div className="font-normalt space-y-6 text-justify text-sm leading-relaxed text-gray-600 md:text-base">
            <p>
              Khám phá thế giới ẩm thực đa dạng tại NS Bến Thuyền, nơi mỗi món
              ăn là một câu chuyện về hương vị và di sản. Chúng tôi tự hào mang
              đến thực đơn A La Carte phong phú, kết hợp hài hòa giữa nguồn hải
              sản tươi sống của vùng biển Cam Ranh và kỹ thuật chế biến đỉnh cao
              từ đội ngũ đầu bếp tâm huyết.
            </p>
            <p>
              Từng nguyên liệu đều được lựa chọn kỹ lưỡng theo mùa, đảm bảo giữ
              trọn vẹn sự tươi ngon và giá trị dinh dưỡng. Không gian thưởng
              thức sang trọng kết hợp cùng mỹ vị tinh tế hứa hẹn sẽ mang đến cho
              quý khách những trải nghiệm ẩm thực khó quên.
            </p>
          </div>
        </motion.div>

        {/* BÊN PHẢI: Hình ảnh Menu và Nút bấm */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="group/menu relative hidden h-full w-full items-center justify-end md:flex"
        >
          {/* Wrapper giới hạn kích thước thực tế của Menu để không bị quá to */}
          <div className="relative w-full max-w-[380px]">
            {/* Ảnh Menu */}
            <div className="relative z-10 overflow-hidden rounded-xl shadow-2xl">
              <LazyImage
                src="/images/home/menualacarte.png"
                alt="Menu Food"
                containerClassName="h-[520px] w-full"
                className="object-cover transition-transform duration-1000 group-hover/menu:scale-105"
              />
            </div>

            {/* Nút bấm Popup */}
            <motion.button
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.8,
              }}
              onClick={() => setShowModal(true)}
              className="group absolute top-1/2 -right-6 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow-xl transition-all duration-300 hover:bg-[#1A2542] hover:text-white"
            >
              <IconChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Button Mobile */}
      <div className="container">
        <div className="mt-[-10px] flex md:hidden">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-secondary flex h-12 w-48 items-center justify-center rounded-sm px-4 text-sm font-bold tracking-[0.2em] text-white uppercase shadow-lg transition-all duration-300 active:scale-95"
          >
            Xem Thực Đơn
          </motion.button>
        </div>
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
