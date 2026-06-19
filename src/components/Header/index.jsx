import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { FiCalendar } from "react-icons/fi";
import { NAV_LINKS, HEADER_ACTIONS } from "../../constants/nav";

// Helper components to render SVG icons inline with custom stroke colors
const MenuIcon = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 6C14.9203 6 15.8283 6.21171 16.6537 6.61876C17.4791 7.02581 18.1999 7.61729 18.7601 8.34743C19.3204 9.07758 19.7052 9.92682 19.8847 10.8295C20.0643 11.7321 20.0338 12.6639 19.7956 13.5529C19.5574 14.4419 19.1179 15.2641 18.511 15.9561C17.9042 16.648 17.1464 17.1911 16.2961 17.5433C15.4458 17.8955 14.5259 18.0473 13.6076 17.9872C12.6892 17.927 11.797 17.6563 11 17.1962" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M7 19V5" stroke="currentColor" stroke-width="2"/>
    <path d="M10 5V9.5C10 10.3284 9.32843 11 8.5 11C7.67157 11 7 10.3284 7 9.5V5" stroke="currentColor" stroke-width="2"/>
    <path d="M4 5V9.5C4 10.3284 4.67157 11 5.5 11C6.32843 11 7 10.3284 7 9.5V5" stroke="currentColor" stroke-width="2"/>
  </svg>
);

const ContactIcon = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.2"/>
    <path d="M4 9L11.1056 12.5528C11.6686 12.8343 12.3314 12.8343 12.8944 12.5528L20 9" stroke="currentColor" stroke-width="1.2"/>
    <path d="M5.85449 6.59961H18.1455C18.8381 6.59961 19.4004 7.16187 19.4004 7.85449C19.4002 8.32924 19.1316 8.76315 18.707 8.97559L12.626 12.0166C12.232 12.2135 11.768 12.2135 11.374 12.0166L5.29297 8.97559C4.8684 8.76315 4.59976 8.32924 4.59961 7.85449C4.59961 7.16187 5.16187 6.59961 5.85449 6.59961Z" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.2"/>
  </svg>
);

const Header = ({ onOpenContact, onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (href) => {
    if (href === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(href);
  };

  // Hiệu ứng đổi nền khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        layout
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 20,
          mass: 0.8,
        }}
        className={`fixed right-0 left-0 z-50 mx-auto flex items-center justify-between transition-[background-color,border-color,backdrop-filter,box-shadow] duration-500 ease-in-out ${
          scrolled
            ? "top-4 w-[92%] max-w-[1400px] rounded-full border border-slate-100 bg-white/80 backdrop-blur-md px-8 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)] md:py-3 lg:w-[94%]"
            : "top-0 w-full border-b border-slate-100 bg-white/90 px-6 py-4 backdrop-blur-md md:px-10 md:py-6"
        }`}
      >
        {/* LOGO - Luôn hiển thị bên trái */}
        <div className="flex flex-1 items-center justify-start">
          <motion.img
            layout
            src="/logo/logo_scroll.png"
            alt="NS Bến Thuyền"
            className={`w-auto object-contain transition-all duration-500 ease-in-out ${
              scrolled ? "h-8 md:h-11" : "h-10 md:h-16"
            }`}
          />
        </div>

        {/* NAVIGATION - Ẩn trên Mobile, hiện trên Desktop */}
        <nav className="hidden flex-shrink-0 justify-center space-x-8 whitespace-nowrap lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm tracking-widest whitespace-nowrap uppercase transition-colors ${
                  active
                    ? "text-primary font-bold"
                    : "font-normal text-slate-700 hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* ACTIONS - Ẩn trên Mobile, hiện trên Desktop */}
        <div className="hidden flex-1 items-center justify-end space-x-6 text-sm lg:flex">
          {HEADER_ACTIONS.map((action) => {
            const isContact = action.name === "Liên hệ" || action.href === "#contact";
            const isBooking = action.name === "Đặt bàn" || action.href === "#booking";

            if (isContact) {
              return (
                <button
                  key={action.name}
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenContact?.();
                  }}
                  className="group flex cursor-pointer items-center space-x-2 border-none bg-transparent focus:outline-none"
                >
                  <ContactIcon className="h-5 w-5 text-primary transition-colors group-hover:text-primary" />
                  <span className="text-[12px] tracking-widest uppercase transition-colors text-slate-700 group-hover:text-primary">
                    {action.name}
                  </span>
                </button>
              );
            }

            if (isBooking) {
              return (
                <button
                  key={action.name}
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenBooking?.();
                  }}
                  className="group flex cursor-pointer items-center space-x-2 border-none bg-transparent focus:outline-none"
                >
                  <FiCalendar className="h-5 w-5 text-primary transition-colors group-hover:text-primary" />
                  <span className="text-[12px] tracking-widest uppercase transition-colors text-slate-700 group-hover:text-primary">
                    {action.name}
                  </span>
                </button>
              );
            }

            return null;
          })}
        </div>

        {/* NÚT HAMBURGER - Chỉ hiện trên Mobile */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex lg:hidden p-1 text-3xl transition-colors text-slate-800"
        >
          <HiMenuAlt3 />
        </button>
      </motion.header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Lớp nền mờ phía sau */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-primary-gradient fixed top-0 right-0 z-[70] h-full w-[80%] max-w-[300px] p-8 shadow-2xl lg:hidden"
            >
              <div className="flex h-full flex-col">
                {/* Nút đóng */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="mb-12 self-end text-3xl text-white"
                >
                  <IoClose />
                </button>

                {/* Danh sách Links */}
                <nav className="flex flex-col space-y-8">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg tracking-[0.2em] uppercase transition-colors ${
                        isActive(link.href)
                          ? "text-secondary font-bold"
                          : "font-normal hover:text-secondary text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                {/* Actions bên dưới menu mobile */}
                <div className="mt-auto space-y-6 border-t border-white/10 pt-8">
                  {HEADER_ACTIONS.map((action) => {
                    const isContact = action.name === "Liên hệ" || action.href === "#contact";
                    const isBooking = action.name === "Đặt bàn" || action.href === "#booking";

                    if (isContact) {
                      return (
                        <button
                          key={action.name}
                          onClick={() => {
                            setIsOpen(false);
                            onOpenContact?.();
                          }}
                          className="hover:text-secondary flex w-full cursor-pointer items-center space-x-4 border-none bg-transparent text-left text-white transition-colors focus:outline-none"
                        >
                          <ContactIcon className="h-6 w-6 text-white" />
                          <span className="text-sm tracking-widest uppercase">
                            {action.name}
                          </span>
                        </button>
                      );
                    }

                    if (isBooking) {
                      return (
                        <button
                          key={action.name}
                          onClick={() => {
                            setIsOpen(false);
                            onOpenBooking?.();
                          }}
                          className="hover:text-secondary flex w-full cursor-pointer items-center space-x-4 border-none bg-transparent text-left text-white transition-colors focus:outline-none"
                        >
                          <FiCalendar className="h-6 w-6 text-white" />
                          <span className="text-sm tracking-widest uppercase">
                            {action.name}
                          </span>
                        </button>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
