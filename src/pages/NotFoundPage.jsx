import React from "react";
// Nhớ import Link nếu bạn dùng react-router-dom
// import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      // TODO: Thay thế bằng ảnh phong cảnh thật chill của dự án
      style={{ backgroundImage: "url('/images/hero/yenbay_retreat_bg.png')" }}
    >
      {/* Lớp phủ đen mờ */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Nội dung chính */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 text-center text-white">
        {/* Số 404 mờ ảo phía sau hoặc nhỏ ở trên */}

        {/* Tiêu đề */}
        <h1 className="font-heading mb-6 text-4xl font-bold tracking-widest text-[#E8DCC4] uppercase md:text-5xl lg:text-6xl">
          Bạn đã lạc bước
        </h1>

        {/* Lời tựa */}
        <p className="font-montserrat font-normalt mb-10 text-[14px] leading-relaxed text-white/90 md:text-base lg:text-lg">
          Có vẻ như bạn đã đi chệch khỏi hành trình khám phá{" "}
          <span className="font-bold">NS GROUP</span>. Trang bạn đang tìm kiếm
          không tồn tại, đã được thay đổi tên hoặc dời đi. Hãy quay lại trang
          chủ để tiếp tục trải nghiệm tuyệt tác của chúng tôi.
        </p>

        {/* Nút quay lại */}
        {/* Nếu dùng react-router-dom, đổi thẻ <a> thành <Link to="/"> */}
        <a
          href="/"
          className="font-montserrat mb-16 flex items-center gap-x-2 border border-[#E8DCC4] bg-transparent px-8 py-3 text-sm font-semibold tracking-wider text-[#E8DCC4] uppercase transition-all hover:bg-[#E8DCC4] hover:text-black md:px-10 md:py-4 md:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Trở về trang chủ
        </a>

        {/* Thông tin liên hệ */}
        <div className="font-montserrat font-normalt flex flex-col items-center gap-y-3 text-[13px] text-white/80 md:text-[15px]">
          <p className="tracking-wide">
            Nếu bạn cần hỗ trợ thêm thông tin, Quý khách vui lòng liên hệ:
          </p>

          <div className="flex flex-col items-center gap-y-2 md:flex-row md:gap-x-6">
            <a
              href="tel:0909886058"
              className="transition-colors hover:text-[#E8DCC4]"
            >
              <span className="tracking-wider">Hotline:</span>{" "}
              <span className="font-medium">0778.727.894</span>
            </a>

            <span className="hidden md:block">|</span>

            <a
              href="mailto:nsgroup@gmail.com"
              className="transition-colors hover:text-[#E8DCC4]"
            >
              <span className="tracking-wider">Email:</span>{" "}
              <span className="font-medium">nsgroup@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
