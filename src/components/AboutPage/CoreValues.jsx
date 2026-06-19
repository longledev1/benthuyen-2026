import { motion } from "framer-motion";
import LazyImage from "../LazyImage";

const vegImage1 = "/images/about/seafood.webp"; // Rau xanh kệ
const vegImage2 = "/images/about/ngudan.webp"; // Rau củ quả
const chefImage = "/images/about/chef.webp"; // Đầu bếp chế biến (Trắng đen)
const birdsImage = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80"; // Chim hải âu bay lượn (Trắng đen)
const platePlatingImage = "/images/about/phucvu.webp"; // Đầu bếp plating món ăn (Màu)

const CoreValues = () => {
  return (
    <section className="overflow-hidden bg-white py-16 md:py-24 lg:py-28">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-24 px-5 sm:px-8 md:gap-32 md:px-12 lg:gap-40 lg:px-16 xl:px-20">

        {/* ROW 1: ẨM THỰC NGUYÊN BẢN (Ảnh trái - Chữ phải căn phải) */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-28">

          {/* Cột ảnh (Bên trái: 2 ảnh đè chồng lên nhau) */}
          <div className="relative flex items-center justify-center w-full aspect-[4/3] max-w-[550px] mx-auto lg:mx-0">
            {/* Ảnh sau (Dịch lên trên bên trái) */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: -20 }}
              whileInView={{ opacity: 0.9, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-0 left-0 w-[72%] aspect-[4/3] rounded-[24px] overflow-hidden shadow-lg bg-gray-100"
            >
              <LazyImage
                src={vegImage1}
                alt="Rau quả tươi ngon"
                className="object-cover transition-transform duration-1000 hover:scale-[1.03]"
              />
            </motion.div>

            {/* Ảnh trước (Dịch xuống dưới bên phải, đè lên ảnh kia) */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute bottom-0 right-0 w-[72%] aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl border-4 border-white bg-gray-100"
            >
              <LazyImage
                src={vegImage2}
                alt="Nguyên liệu nguyên bản"
                className="object-cover transition-transform duration-1000 hover:scale-[1.03]"
              />
            </motion.div>
          </div>

          {/* Cột chữ (Bên phải - Căn phải) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-end text-right space-y-6"
          >
            {/* Heading + Badge */}
            <div className="flex items-center gap-4">
              {/* Badge tròn màu xanh navy, icon nhành lá gold */}

              <img src="/images/about/food_icon.svg" alt="" className="w-12 h-12" />

              <h3 className="font-sans text-xl md:text-2xl font-bold tracking-wider text-primary uppercase">
                Ẩm thực nguyên bản
              </h3>
            </div>

            {/* Văn bản mô tả */}
            <div className="max-w-[580px] space-y-5 text-[15px] font-normal leading-[1.8] text-[#7a7a7a] sm:text-base">
              <p>
                Chúng tôi tin rằng đỉnh cao của nghệ thuật ẩm thực nằm ở sự tôn trọng hương vị tự nhiên của nguyên liệu. Tại NS Bến Thuyền, hải sản được lựa chọn kỹ lượng từ vùng biển Cam Ranh và các vùng biển trứ danh, giữ trọn độ tươi ngon tinh khiết từ đại dương đến bàn tiệc của {"thực\u00A0khách."}
              </p>
              <p>
                Không lạm dụng gia vị cầu kỳ, các món ăn được chế biến để làm nổi bật vị ngọt thanh nguyên bản. Đó là cách chúng tôi gìn giữ di sản hương vị hơn sáu thập kỷ qua, mang đến trải nghiệm ẩm thực chân thực và {"tinh\u00A0túy\u00A0nhất."}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ROW 2: TRÁI TIM TÂM HUYẾT (Chữ trái căn trái - Ảnh phải) */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-28">

          {/* Cột chữ (Bên trái - Căn trái) - Trên mobile xếp bên trên ảnh */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-1 lg:order-1 flex flex-col items-start text-left space-y-6"
          >
            {/* Heading + Badge */}
            <div className="flex items-center gap-4">
              <h3 className="font-sans text-xl md:text-2xl font-bold tracking-wider text-primary uppercase">
                Trái tim tâm huyết
              </h3>
              {/* Badge tròn màu xanh navy, icon trái tim nâng niu gold */}
              <img src="/images/about/heart_icon.svg" alt="" className="w-12 h-12" />

            </div>

            {/* Văn bản mô tả */}
            <div className="max-w-[580px] space-y-5 text-[15px] font-normal leading-[1.8] text-[#7a7a7a] sm:text-base">
              <p>
                Mỗi đĩa ăn được phục vụ tại NS Bến Thuyền không chỉ là kết quả của kỹ thuật nấu nướng tài hoa, mà còn gửi gắm trọn vẹn tấm lòng và sự tận tụy của đội ngũ đầu bếp. Chúng tôi chăm chút từng chi tiết nhỏ nhất, từ cách bài trí món ăn đến sự hài hòa trong {"hương\u00A0vị."}
              </p>
              <p>
                Đối với chúng tôi, ẩm thực là chiếc cầu nối cảm xúc. Sự hài lòng và những nụ cười rạng rỡ của thực khách bên bàn tiệc chính là nguồn động lực lớn nhất để NS Bến Thuyền không ngừng sáng tạo và hoàn thiện {"mỗi\u00A0ngày."}
              </p>
            </div>
          </motion.div>

          {/* Cột ảnh (Bên phải - Ảnh đơn trắng đen) - Trên mobile xếp dưới text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="order-2 lg:order-2 w-full aspect-[1.6/1] overflow-hidden rounded-[24px] shadow-lg bg-gray-100"
          >
            <LazyImage
              src={chefImage}
              alt="Người đầu bếp tâm huyết"
              className="object-cover grayscale transition-transform duration-1000 hover:scale-[1.03]"
            />
          </motion.div>
        </div>

        {/* ROW 3: CON NGƯỜI CHÂN THÀNH (Ảnh trái - Chữ phải căn phải) */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-28">
          {/* Cột ảnh (Bên trái: 2 ảnh đè chồng lên nhau) */}
          <div className="relative flex items-center justify-center w-full aspect-[4/3] max-w-[550px] mx-auto lg:mx-0">
            {/* Ảnh sau (Dịch lên trên bên trái - Trắng đen) */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: -20 }}
              whileInView={{ opacity: 0.9, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-0 left-0 w-[72%] aspect-[4/3] rounded-[24px] overflow-hidden shadow-lg bg-gray-100"
            >
              <LazyImage
                src={birdsImage}
                alt="Chim hải âu bay lượn"
                className="object-cover grayscale transition-transform duration-1000 hover:scale-[1.03]"
              />
            </motion.div>

            {/* Ảnh trước (Dịch xuống dưới bên phải, đè lên ảnh kia - Có màu) */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute bottom-0 right-0 w-[72%] aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl border-4 border-white bg-gray-100"
            >
              <LazyImage
                src={platePlatingImage}
                alt="Đầu bếp chuẩn bị đĩa ăn"
                className="object-cover transition-transform duration-1000 hover:scale-[1.03]"
              />
            </motion.div>
          </div>

          {/* Cột chữ (Bên phải - Căn phải) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-end text-right space-y-6"
          >
            {/* Heading + Badge */}
            <div className="flex items-center gap-4">
              {/* Badge tròn màu xanh navy, icon nhành lá gold */}
              <img src="/images/about/human_icon.svg" alt="" className="w-12 h-12" />
              <h3 className="font-sans text-xl md:text-2xl font-bold tracking-wider text-primary uppercase">
                Con người chân thành
              </h3>
            </div>

            {/* Văn bản mô tả */}
            <div className="max-w-[580px] space-y-5 text-[15px] font-normal leading-[1.8] text-[#7a7a7a] sm:text-base">
              <p>
                Đằng sau sự phát triển của thương hiệu chính là những con người giản dị, nhiệt huyết và luôn nỗ lực vì sự hài lòng của thực khách. Đội ngũ NS Bến Thuyền được gắn kết bởi tinh thần chân thành, hiếu khách và mong muốn kiến tạo những giá trị tốt đẹp trong từng khoảnh khắc
              </p>
              <p>
                Từ những người đầu bếp tâm huyết trong bếp đến nhân viên phục vụ tận tình tại bàn ăn, mỗi thành viên đều nỗ lực thấu hiểu mong muốn của khách hàng, đem lại trải nghiệm trọn vẹn và thân thuộc
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default CoreValues;
