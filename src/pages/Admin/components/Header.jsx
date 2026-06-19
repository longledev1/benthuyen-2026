import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiMenu, FiSettings } from "react-icons/fi";

export const Header = ({ setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;
  const [time, setTime] = useState(new Date());

  // Cập nhật thời gian mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Định dạng thời gian hiển thị: DD/MM/YYYY - HH:MM:SS
  const formatTime = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  };

  // Xác định tiêu đề động theo URL path hiện tại
  const getViewTitle = () => {
    if (pathname.includes("/admin/gallery/upload")) {
      return "Đăng Tải Hình Ảnh Thư Viện Mới";
    }
    if (pathname.includes("/admin/gallery")) {
      return "Danh Sách Hình Ảnh Thư Viện";
    }
    if (pathname.includes("/admin/posts/new")) {
      return "Soạn Thảo Bài Viết Mới";
    }
    if (pathname.includes("/admin/posts")) {
      return "Danh Sách Các Bài Viết";
    }
    if (pathname.includes("/admin/contacts")) {
      return "Danh Sách Ý Kiến Liên Hệ & Phản Hồi";
    }
    return "Trang Tổng Quan Quản Trị";
  };

  return (
    <header className="z-20 flex h-20 flex-shrink-0 items-center justify-between border-b border-black/5 bg-white px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="hover:text-primary cursor-pointer p-1 text-slate-500"
        >
          <FiMenu size={22} />
        </button>
        <h2 className="text-primary font-sans text-xl font-bold tracking-wide">
          {getViewTitle()}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden text-right sm:block">
          <p className="text-xs text-slate-400">Thời gian hệ thống</p>
          <p className="font-sans text-xs font-semibold text-slate-700">
            {formatTime(time)}
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
