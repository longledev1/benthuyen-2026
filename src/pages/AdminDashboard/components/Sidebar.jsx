import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiImage,
  FiFileText,
  FiPhoneCall,
  FiChevronDown,
  FiChevronUp,
  FiLogOut,
  FiX,
} from "react-icons/fi";

export const Sidebar = ({
  currentView,
  setCurrentView,
  sidebarOpen,
  setSidebarOpen,
  pendingContactsCount,
}) => {
  // Trạng thái đóng/mở dropdown của menu sidebar
  const [menuOpen, setMenuOpen] = useState({
    gallery: true,
    posts: true,
  });

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-0 lg:w-20"
      } bg-primary relative z-30 flex flex-shrink-0 flex-col overflow-hidden text-white transition-all duration-300`}
    >
      {/* Logo header sidebar */}
      <div className="flex h-20 flex-shrink-0 items-center justify-between border-b border-white/5 px-6">
        <div className="flex items-center space-x-3 overflow-hidden">
          <img
            src="/logo/nsbenthuyen_white.png"
            alt="Logo"
            className="h-10 w-auto flex-shrink-0 object-contain"
          />
          {sidebarOpen && (
            <span className="text-secondary font-serif text-sm font-semibold tracking-[0.1em] whitespace-nowrap">
              QUẢN TRỊ
            </span>
          )}
        </div>
        {/* Nút đóng sidebar trên mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-gray-400 hover:text-white lg:hidden"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 space-y-3 overflow-y-auto px-4 py-6">
        {/* MODULE 1: QUẢN LÝ HÌNH ẢNH */}
        <div className="space-y-1">
          <button
            onClick={() =>
              setMenuOpen((prev) => ({ ...prev, gallery: !prev.gallery }))
            }
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium tracking-wide transition-all ${
              currentView.includes("images")
                ? "text-secondary bg-white/5"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <FiImage size={18} />
              {sidebarOpen && <span>Quản lý hình ảnh</span>}
            </div>
            {sidebarOpen &&
              (menuOpen.gallery ? (
                <FiChevronUp size={14} />
              ) : (
                <FiChevronDown size={14} />
              ))}
          </button>

          {menuOpen.gallery && sidebarOpen && (
            <div className="space-y-1 py-1 pr-2 pl-9">
              <button
                onClick={() => setCurrentView("upload-images")}
                className={`w-full py-2 text-left text-xs font-semibold tracking-wider uppercase transition-colors ${
                  currentView === "upload-images"
                    ? "text-secondary"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                ➔ Đăng ảnh
              </button>
              <button
                onClick={() => setCurrentView("view-images")}
                className={`w-full py-2 text-left text-xs font-semibold tracking-wider uppercase transition-colors ${
                  currentView === "view-images"
                    ? "text-secondary"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                ➔ Xem các hình ảnh
              </button>
            </div>
          )}
        </div>

        {/* MODULE 2: QUẢN LÝ BÀI VIẾT */}
        <div className="space-y-1">
          <button
            onClick={() =>
              setMenuOpen((prev) => ({ ...prev, posts: !prev.posts }))
            }
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium tracking-wide transition-all ${
              currentView.includes("post")
                ? "text-secondary bg-white/5"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <FiFileText size={18} />
              {sidebarOpen && <span>Quản lý bài viết</span>}
            </div>
            {sidebarOpen &&
              (menuOpen.posts ? (
                <FiChevronUp size={14} />
              ) : (
                <FiChevronDown size={14} />
              ))}
          </button>

          {menuOpen.posts && sidebarOpen && (
            <div className="space-y-1 py-1 pr-2 pl-9">
              <button
                onClick={() => setCurrentView("write-post")}
                className={`w-full py-2 text-left text-xs font-semibold tracking-wider uppercase transition-colors ${
                  currentView === "write-post"
                    ? "text-secondary"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                ➔ Đăng bài
              </button>
              <button
                onClick={() => setCurrentView("view-posts")}
                className={`w-full py-2 text-left text-xs font-semibold tracking-wider uppercase transition-colors ${
                  currentView === "view-posts"
                    ? "text-secondary"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                ➔ Xem các bài viết
              </button>
            </div>
          )}
        </div>

        {/* MODULE 3: QUẢN LÝ LIÊN HỆ */}
        <div>
          <button
            onClick={() => setCurrentView("manage-contacts")}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium tracking-wide transition-all ${
              currentView === "manage-contacts"
                ? "text-secondary bg-white/5"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <FiPhoneCall size={18} />
              {sidebarOpen && <span>Quản lý liên hệ</span>}
            </div>
            {/* Badge thông báo màu đỏ hiển thị số liên hệ chưa xử lý */}
            {pendingContactsCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-50 px-1 text-[10px] font-bold text-white">
                {pendingContactsCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Footer Sidebar: Tài khoản & Đăng xuất */}
      <div className="flex-shrink-0 space-y-4 border-t border-white/5 p-4">
        {sidebarOpen && (
          <div className="flex items-center space-x-3 px-2">
            <div className="bg-secondary flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-[#0F1524]">
              BT
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Bến Thuyền Admin</p>
              <p className="truncate text-[10px] text-gray-500">
                admin@nsbenthuyen.vn
              </p>
            </div>
          </div>
        )}
        <Link
          to="/"
          className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-xs font-bold tracking-wider text-rose-400 uppercase transition-colors hover:bg-rose-500/10"
        >
          <FiLogOut size={16} />
          {sidebarOpen && <span>Về Trang Chủ</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
