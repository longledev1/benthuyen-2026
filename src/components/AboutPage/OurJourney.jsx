import { motion as Motion } from "framer-motion";
import LazyImage from "../LazyImage";

const journeyImage = "/images/about/journey.png";

const OurJourney = () => {
  return (
    <section className="overflow-hidden bg-white pt-[100px]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-6 px-5 sm:px-8 md:gap-10 md:px-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20 lg:px-16 xl:gap-28 xl:px-20">
        <Motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col pt-2 pb-2 lg:pt-4 lg:pb-12"
        >
          {/* ĐÃ SỬA: Giảm mt-8 ở mobile xuống mt-5 để phần text trông gọn gàng, khít hơn */}
          <h2 className="font-script text-primary mt-5 max-w-[650px] text-[32px] leading-14 font-normal sm:text-[38px] md:mt-10 md:text-[44px] lg:text-[42px] xl:text-[48px]">
            “Một hành trình được bắt đầu từ sự giản dị, nhưng được gìn giữ bằng
            đam mê suốt hơn sáu thập kỷ”
          </h2>

          {/* ĐÃ SỬA: Giảm my-10 ở mobile xuống my-6 đối với đường line kẻ ngang */}
          <div className="bg-primary my-6 -ml-5 h-[1.5px] w-[calc(55%+1.25rem)] min-[1600px]:-ml-[calc((100vw-1600px)/2+5rem)] min-[1600px]:w-[calc(55%+calc((100vw-1600px)/2+5rem))] sm:-ml-8 sm:w-[calc(55%+2rem)] md:my-12 md:-ml-12 md:w-[calc(55%+3rem)] lg:my-14 lg:-ml-16 lg:w-[calc(55%+4rem)] xl:-ml-20 xl:w-[calc(55%+5rem)]" />

          {/* ĐÃ SỬA: Giảm space-y-7 xuống space-y-5 ở mobile cho các đoạn văn sát nhau hơn một chút */}
          <div className="font-normalt max-w-[650px] space-y-5 text-[15px] leading-[1.8] text-[#575757] sm:text-base md:space-y-7 md:text-[17px]">
            <p>
              Trong bức tranh ẩm thực phong phú của Sài Gòn, những nhà hàng hải
              sản thực sự chạm đến chiều sâu trải nghiệm không nhiều. Và càng
              hiếm hơn khi một nơi có thể dung hòa trọn vẹn ba giá trị cốt lõi:{" "}
              <strong className="text-primary font-semibold">
                ẩm thực sáng tạo – trải nghiệm tinh tế – sự tận tâm trong từng
                chi tiết phục vụ.
              </strong>
            </p>
            <p>
              Hơn sáu thập kỷ trước, trên tuyến Quốc Lộ 1A thuộc vùng đất Cam
              Ranh, một quán ăn mái lá mộc mạc đã trở thành điểm dừng chân quen
              thuộc của bao lữ khách. Không cầu kỳ, không phô trương, nơi ấy ghi
              dấu bằng những món hải sản chế biến giản dị nhưng đậm đà, mang
              trọn tinh thần ẩm thực Việt.
            </p>
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="h-[400px] overflow-hidden rounded-[24px] md:h-[650px]"
        >
          <LazyImage
            src={journeyImage}
            alt="Hành trình bên biển"
            className="object-cover transition-transform duration-[1800ms] hover:scale-[1.025]"
          />
        </Motion.div>
      </div>
    </section>
  );
};

export default OurJourney;
