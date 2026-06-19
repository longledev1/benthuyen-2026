import { motion } from "framer-motion";
import LazyImage from "../LazyImage";

const image1 = "/images/about/ns2.webp";
const image2 = "/images/about/ns.webp";
const image3 = "/images/about/ns3.webp";
const image4 = "/images/about/ns4.webp";

const BrandPhilosophy = () => {
  return (
    <section className="bg-primary-gradient relative w-full overflow-hidden py-12 text-white sm:py-16 md:py-20">
      {/* Nhành lá trang trí - Đổi sang absolute để bám sát rạt mép phải màn hình mà không đẩy khoảng cách hai row */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 0.6, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="pointer-events-none absolute top-1/2 right-0 z-10 hidden -translate-y-1/2 md:block"
      >
        <img
          src="/images/about/line.png"
          alt="Decorative line"
          className="h-auto w-[350px] object-contain object-right lg:w-[500px] xl:w-[650px]"
        />
      </motion.div>

      <div className="relative z-20 mx-auto flex max-w-[1600px] flex-col gap-12 px-5 sm:px-8 md:px-12 lg:gap-80 lg:px-16 xl:px-20">
        {/* ROW 1: TRUYỀN THỐNG & HIỆN ĐẠI */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* Cột chữ (Bên trái) */}
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col space-y-4 md:space-y-5"
          >
            <h2 className="font-script text text-[38px] leading-[1] font-normal sm:text-[46px] md:text-[52px] lg:text-[48px] xl:text-[62px]">
              Giao thoa giữa truyền thống và hiện đại
            </h2>
            <div className="font-normalt max-w-[580px] space-y-4 text-[15px] leading-[1.7] text-white/80 sm:text-base">
              <p>
                Theo dòng chảy của thời gian, NS Bến Thuyền đã không ngừng
                chuyển mình để thích nghi với nhịp sống hiện đại, đồng thời vẫn
                giữ vững giá trị cốt lõi đã làm nên bản sắc riêng.
              </p>
              <p>
                Tại Thành phố Hồ Chí Minh, sau nhiều lần thay đổi và phát triển,
                NS Bến Thuyền hiện diện như một điểm đến ẩm thực mang phong cách
                chỉn chu, sang trọng nhưng không xa cách. Không gian được thiết
                kế để vừa đủ riêng tư cho những buổi gặp gỡ quan trọng, vừa đủ
                ấm cúng cho những cuộc hội ngộ thân tình.
              </p>
            </div>
          </motion.div>

          {/* Cột ảnh (Bên phải - Giảm bớt mt-xx để bớt thưa) */}
          <div className="flex items-start justify-center gap-4 sm:gap-6 lg:justify-start">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="aspect-[3/4.1] w-[47%] overflow-hidden rounded-[16px] bg-white/5 shadow-2xl sm:rounded-[24px]"
            >
              <LazyImage
                src={image1}
                alt="Ẩm thực tinh tế"
                className="object-cover transition-transform duration-1000 hover:scale-[1.04]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="mt-8 aspect-[3/4.1] w-[47%] overflow-hidden rounded-[16px] bg-white/5 shadow-2xl sm:mt-12 sm:rounded-[24px] lg:mt-16"
            >
              <LazyImage
                src={image2}
                alt="Không gian nhà hàng sang trọng"
                className="object-cover transition-transform duration-1000 hover:scale-[1.04]"
              />
            </motion.div>
          </div>
        </div>

        {/* ROW 2: BẢN SẮC & NIỀM TIN */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* Cột ảnh (Bên trái) */}
          <div className="order-2 flex items-start justify-center gap-4 sm:gap-6 lg:order-1 lg:justify-start">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="aspect-[3/4.1] w-[47%] overflow-hidden rounded-[16px] bg-white/5 shadow-2xl sm:rounded-[24px]"
            >
              <LazyImage
                src={image3}
                alt="Không gian nhà hàng ấm áp"
                className="object-cover transition-transform duration-1000 hover:scale-[1.04]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="mt-8 aspect-[3/4.1] w-[47%] overflow-hidden rounded-[16px] bg-white/5 shadow-2xl sm:mt-12 sm:rounded-[24px] lg:mt-16"
            >
              <LazyImage
                src={image4}
                alt="Bàn tiệc chỉn chu"
                className="object-cover transition-transform duration-1000 hover:scale-[1.04]"
              />
            </motion.div>
          </div>

          {/* Cột chữ (Bên phải) */}
          <motion.div
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-1 flex flex-col items-end space-y-4 text-right md:space-y-5 lg:order-2"
          >
            <h2 className="font-script w-full text-[38px] leading-[1.1] font-normal whitespace-nowrap sm:text-[46px] md:text-[52px] lg:text-[48px] xl:text-[62px]">
              Bản sắc và niềm tin của Bến Thuyền
            </h2>
            <div className="font-normalt max-w-[580px] space-y-4 text-[15px] leading-[1.7] text-white/80 sm:text-base">
              <p>
                Tại Bến Thuyền, mỗi món ăn là sự kết hợp hài hòa giữa nguồn hải
                sản tươi ngon và sự chăm chút trong từng công đoạn chế biến.
                Chúng tôi tin rằng một bữa ăn đáng nhớ không chỉ đến từ nguyên
                liệu chất lượng mà còn từ cách hương vị được gìn giữ và nâng tầm
                qua bàn tay của những đầu bếp giàu kinh nghiệm.
              </p>
              <p>
                Tại Thành phố Hồ Chí Minh, sau nhiều lần thay đổi và phát triển,
                NS Bến Thuyền hiện diện như một điểm đến ẩm thực mang phong cách
                chỉn chu, sang trọng nhưng không xa cách. Không gian được thiết
                kế để vừa đủ riêng tư cho những buổi gặp gỡ quan trọng, vừa đủ
                ấm cúng cho những cuộc hội ngộ thân tình.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandPhilosophy;
