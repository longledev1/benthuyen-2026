import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiPhone, FiMail, FiMapPin, FiGlobe, FiArrowLeft } from "react-icons/fi";
import SEO from "../components/SEO";

const NotFoundPage = () => {
  return (
    <>
      <SEO
        title="404 - Không Tìm Thấy Trang"
        description="Trang bạn tìm kiếm không tồn tại trên hệ thống NS Bến Thuyền."
        noindex={true}
      />

      <div className="flex min-h-screen flex-col justify-between bg-white text-slate-800">
        {/* HEADER: Logo nằm góc trái màn hình chuẩn Navigation Bar */}
        <header className="flex w-full items-center justify-between border-b border-slate-100 px-6 py-4 md:px-12">
          <Link to="/" className="inline-block transition-opacity hover:opacity-85">
            <img
              src="/Logo_new.png"
              alt="NS Bến Thuyền"
              className="h-10 w-auto object-contain md:h-12"
            />
          </Link>

          {/* Nút quay lại nhanh ở góc phải */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-[#3c6881] md:text-sm"
          >
            <FiArrowLeft className="h-4 w-4" />
            <span>Trang chủ</span>
          </Link>
        </header>

        {/* TRUNG TÂM: Nội dung 404 cân đối, tự nhiên */}
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
          <span className="font-serif text-6xl font-bold tracking-tight bg-primary-gradient bg-clip-text text-transparent leading-none md:text-7xl">
            404
          </span>

          <h1 className="mt-4 text-xl font-bold uppercase tracking-wider text-slate-800 md:text-2xl">
            Không Tìm Thấy Trang
          </h1>

          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-500 md:text-sm">
            Trang bạn đang truy cập không tồn tại, đã bị xóa hoặc đường dẫn đã có sự thay đổi.
          </p>

          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-gradient px-7 py-3 text-xs font-semibold tracking-wider text-white uppercase shadow-md shadow-[#3c6881]/25 transition-all duration-200 hover:brightness-105 hover:shadow-lg md:text-sm"
            >
              <FiHome className="h-4 w-4" />
              <span>Trở về trang chủ</span>
            </Link>
          </div>
        </main>

        {/* PHÍA DƯỚI (BOTTOM): Địa chỉ, Website, SĐT, Email */}
        <footer className="w-full border-t border-slate-200 py-6">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center text-xs text-slate-600 md:text-sm">
            {/* Địa chỉ */}
            <div className="flex items-center gap-2 px-3 py-1.5 md:px-5">
              <FiMapPin className="h-4 w-4 shrink-0 text-[#3c6881]" />
              <span>21S - 21T Nguyễn Văn Trỗi, P. Phú Nhuận, TP.HCM</span>
            </div>

            <span className="hidden h-3.5 w-px bg-slate-300 md:inline-block" />

            {/* Số điện thoại */}
            <a
              href="tel:0909886058"
              className="flex items-center gap-2 px-3 py-1.5 transition-colors hover:text-[#3c6881] md:px-5"
            >
              <FiPhone className="h-4 w-4 shrink-0 text-[#3c6881]" />
              <span>0909.886.058</span>
            </a>

            <span className="hidden h-3.5 w-px bg-slate-300 md:inline-block" />

            {/* Website */}
            <a
              href="https://nsbenthuyen.com"
              className="flex items-center gap-2 px-3 py-1.5 transition-colors hover:text-[#3c6881] md:px-5"
            >
              <FiGlobe className="h-4 w-4 shrink-0 text-[#3c6881]" />
              <span>nsbenthuyen.com</span>
            </a>

            <span className="hidden h-3.5 w-px bg-slate-300 md:inline-block" />

            {/* Email */}
            <a
              href="mailto:nsbenthuyen@gmail.com"
              className="flex items-center gap-2 px-3 py-1.5 transition-colors hover:text-[#3c6881] md:px-5"
            >
              <FiMail className="h-4 w-4 shrink-0 text-[#3c6881]" />
              <span>nsbenthuyen@gmail.com</span>
            </a>
          </div>

          <p className="mt-3 text-center text-[12px] text-slate-400">
            © {new Date().getFullYear()} NS Bến Thuyền. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default NotFoundPage;
