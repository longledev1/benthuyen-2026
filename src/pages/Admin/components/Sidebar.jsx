import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiLogOut, FiX } from "react-icons/fi";
import { SIDEBAR_NAV_ITEMS } from "../../../constants/sidebarNav";
import supabase from "../../../lib/supabase";

export const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  pendingContactsCount,
  pendingBookingsCount,
}) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/admin/login");
    } catch (err) {
      console.error("❌ Logout error:", err);
      navigate("/admin/login");
    }
  };
  // Tự động khởi tạo trạng thái mở dropdown cho các menu có dropdown
  const [menuOpen, setMenuOpen] = useState(
    SIDEBAR_NAV_ITEMS.reduce((acc, item) => {
      if (item.hasDropdown) {
        acc[item.id] = true; // Mở mặc định
      }
      return acc;
    }, {}),
  );

  const toggleMenu = (id) => {
    setMenuOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Lấy giá trị badge tương ứng với key cấu hình
  const getBadgeValue = (key) => {
    if (key === "pendingContactsCount") {
      return pendingContactsCount;
    }
    if (key === "pendingBookingsCount") {
      return pendingBookingsCount;
    }
    return null;
  };

  // Helper để check style active của NavLink chính
  const navLinkClass = ({ isActive }) =>
    `w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm tracking-wide transition-all ${
      isActive
        ? "bg-white text-primary font-bold shadow-sm"
        : "text-slate-200 hover:bg-white/5 hover:text-white font-medium"
    }`;

  // Helper để check style active của submenu
  const subNavLinkClass = ({ isActive }) =>
    `w-full text-left py-2 px-3 text-xs tracking-wider uppercase transition-all block rounded ${
      isActive
        ? "bg-white text-primary font-bold shadow-sm"
        : "text-slate-300 hover:text-white font-semibold"
    }`;

  return (
    <aside
      className={`bg-primary-gradient fixed inset-y-0 left-0 z-40 flex flex-shrink-0 flex-col overflow-hidden text-white transition-all duration-300 lg:relative lg:translate-x-0 ${
        sidebarOpen
          ? "w-64 translate-x-0"
          : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
      }`}
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
            <span className="font-sans text-sm font-bold tracking-[0.1em] whitespace-nowrap text-white">
              QUẢN TRỊ
            </span>
          )}
        </div>
        {/* Nút đóng sidebar trên mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="cursor-pointer text-gray-400 hover:text-white lg:hidden"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Danh sách Menu điều hướng kết xuất động từ SIDEBAR_NAV_ITEMS */}
      <nav className="flex-1 space-y-3 overflow-y-auto px-4 py-6">
        {SIDEBAR_NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;

          if (item.hasDropdown) {
            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => toggleMenu(item.id)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium tracking-wide text-slate-200 transition-all hover:bg-white/5 hover:text-white"
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent size={18} />
                    {sidebarOpen && <span>{item.title}</span>}
                  </div>
                  {sidebarOpen &&
                    (menuOpen[item.id] ? (
                      <FiChevronUp size={14} />
                    ) : (
                      <FiChevronDown size={14} />
                    ))}
                </button>

                {menuOpen[item.id] && sidebarOpen && (
                  <div className="space-y-1 py-1 pr-2 pl-9">
                    {item.children.map((child, idx) => (
                      <NavLink
                        key={idx}
                        to={child.path}
                        end={
                          child.path === "/admin/gallery" ||
                          child.path === "/admin/posts"
                        }
                        className={subNavLinkClass}
                      >
                        ➔ {child.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Render link đơn lẻ không có sub-menu
          const badgeValue = item.badgeKey
            ? getBadgeValue(item.badgeKey)
            : null;

          return (
            <div key={item.id}>
              <NavLink to={item.path} className={navLinkClass}>
                <div className="flex items-center space-x-3">
                  <IconComponent size={18} />
                  {sidebarOpen && <span>{item.title}</span>}
                </div>
                {badgeValue > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {badgeValue}
                  </span>
                )}
              </NavLink>
            </div>
          );
        })}
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
              <p className="truncate text-[10px] text-white/50">
                admin@nsbenthuyen.vn
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-col space-y-2 w-full">
          <Link
            to="/"
            className="text-white hover:text-secondary flex w-full items-center justify-center space-x-3 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-all lg:justify-start"
          >
            {sidebarOpen ? <span>Về Trang Chủ</span> : <span>Home</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 flex w-full items-center justify-center space-x-3 rounded-lg px-3 py-2.5 text-xs font-bold tracking-wider uppercase shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer lg:justify-start"
          >
            <FiLogOut size={16} />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
