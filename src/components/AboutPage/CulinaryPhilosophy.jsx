import { motion } from "framer-motion";
import LazyImage from "../LazyImage";

const philosophyImage =
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80";

const CulinaryPhilosophy = () => {
  return (
    <section className="overflow-hidden bg-white py-16 md:py-24 lg:py-28">
      {/* ĐÃ SỬA: Thay đổi tỷ lệ thành [1.2fr_0.8fr] để cột chữ bên trái rộng hơn hẳn cột ảnh */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-14 px-5 sm:px-8 md:px-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:px-16 xl:gap-28 xl:px-20">
        {/* Cột chữ (Bên trái - Rộng rãi hơn) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col space-y-6 md:space-y-8"
        >
          <h3 className="text-secondary font-anton mb-4 text-xl tracking-wide uppercase md:text-4xl">
            OUR CULINARY PHILOSOPHY
          </h3>

          {/* ĐÃ SỬA: Tăng max-w từ 650px lên 750px để tiêu đề đi thoải mái hơn */}
          <h2 className="font-script text-primary max-w-[750px] text-[40px] leading-[1.2] font-normal sm:text-[48px] md:text-[54px] lg:text-[50px] xl:text-[58px]">
            Những giá trị chúng tôi luôn theo đuổi
          </h2>

          {/* ĐÃ SỬA: Tăng max-w lên 750px (hoặc w-full) giúp các đoạn văn và câu chốt của bạn có đủ không gian chạy full hàng */}
          <div className="max-w-[750px] space-y-6 text-[15px] leading-[1.8] font-normal text-[#575757] sm:text-base md:text-[17px]">
            <p>
              Tại{" "}
              <strong className="text-primary font-semibold">
                NS Bến Thuyền
              </strong>
              , ẩm thực không đơn thuần là món ăn –{" "}
              {
                "đó\u00A0là\u00A0sự\u00A0kết\u00A0tinh\u00A0của\u00A0kinh\u00A0nghiệm,\u00A0cảm\u00A0xúc\u00A0và\u00A0lòng\u00A0tận\u00A0tụy."
              }
            </p>
            <p>
              Chúng tôi tin rằng một bữa ăn trọn vẹn không chỉ đến từ nguyên
              liệu tươi ngon mà còn từ cách mỗi món ăn được chăm chút và kể nên
              câu chuyện riêng của nó. Với đội ngũ đầu bếp giàu kinh nghiệm cùng
              tinh thần sáng tạo không ngừng, NS Bến Thuyền mang đến những món
              hải sản vừa giữ được nét nguyên bản, vừa được biến tấu tinh tế để
              phù hợp với{" "}
              {
                "khẩu\u00A0vị\u00A0đa\u00A0dạng\u00A0của\u00A0thực\u00A0khách\u00A0hiện\u00A0đại."
              }
            </p>
            {/* Câu chốt của bạn bây giờ sẽ có không gian rộng để đứng thẳng hàng trên PC/Laptop */}
            <p className="text-primary pt-4 text-[15px] font-normal whitespace-normal italic sm:text-base md:text-[14px] lg:whitespace-nowrap">
              Đó không chỉ là triết lý, mà còn là cam kết đã được{" "}
              {"gìn\u00A0giữ\u00A0suốt\u00A0hơn\u00A060\u00A0năm\u00A0qua."}
            </p>
          </div>
        </motion.div>

        {/* Cột ảnh (Bên phải - Thu nhỏ lại tinh tế hơn) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="aspect-[4/3] w-full overflow-hidden rounded-[24px] rounded-tl-[80px] bg-gray-100 shadow-lg sm:aspect-[1.2/1] sm:rounded-tl-[120px]"
        >
          <LazyImage
            src={philosophyImage}
            alt="Triết lý ẩm thực Bến Thuyền"
            className="object-cover transition-transform duration-[1800ms] hover:scale-[1.03]"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default CulinaryPhilosophy;
