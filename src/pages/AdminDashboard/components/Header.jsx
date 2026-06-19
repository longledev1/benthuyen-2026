import React from "react";
import { FiMenu, FiSettings } from "react-icons/fi";

export const Header = ({ currentView, setSidebarOpen }) => {
  return (
    <header className="z-20 flex h-20 flex-shrink-0 items-center justify-between border-b border-black/5 bg-white px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="hover:text-primary cursor-pointer p-1 text-slate-500"
        >
          <FiMenu size={22} />
        </button>
        <h2 className="text-primary font-serif text-xl font-normal tracking-wide">
          {currentView === "view-images" && "Danh Sách Hình Ảnh Thư Viện"}
          {currentView === "upload-images" && "Đăng Tải Hình Ảnh Thư Viện Mới"}
          {currentView === "view-posts" && "Danh Sách Các Bài Viết"}
          {currentView === "write-post" && "Soạn Thảo Bài Viết Mới"}
          {currentView === "manage-contacts" &&
            "Danh Sách Ý Kiến Liên Hệ & Phản Hồi"}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden text-right sm:block">
          <p className="text-xs text-slate-400">Thời gian hệ thống</p>
          <p className="font-sans text-xs font-semibold text-slate-700">
            16/06/2026 - 22:15
          </p>
        </div>
        <div className="hidden h-8 w-[1px] bg-slate-200 sm:block" />
        <button className="text-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200">
          <FiSettings size={16} />
        </button>
      </div>
    </header>
  );
};

export default Header;
