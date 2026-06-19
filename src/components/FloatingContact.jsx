import React from "react";
import { motion } from "framer-motion";

export const FloatingContact = () => {
  // Lấy hotline thực tế từ FOOTER_CONTACT: 0778.727.894
  const phone = "0778727894";
  const zaloUrl = "https://zalo.me/0778727894";
  const fbUrl = "https://facebook.com";

  // Hiệu ứng hover đặc biệt: Phóng to, nhấc lên, rung nhẹ lò xo (spring) và tỏa hào quang vàng kim
  const hoverEffect = {
    scale: 1.2,
    y: -4,
    rotate: [0, -12, 12, -8, 8, 0],
    boxShadow: "0px 10px 20px rgba(207, 178, 110, 0.45)",
    borderColor: "rgba(207, 178, 110, 0.85)",
    transition: {
      rotate: {
        duration: 0.4,
        ease: "easeInOut",
      },
      scale: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
      y: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  return (
    <div className="fixed right-5 bottom-24 z-[99] flex flex-col items-center">
      {/* Khung Pill dọc mờ ảo (Glassmorphism) viền màu vàng kim nhẹ */}
      <div className="border-secondary/30 flex flex-col items-center space-y-3 rounded-full border bg-white/40 p-2 shadow-[0_8px_32px_0_rgba(38,50,96,0.15)] backdrop-blur-md transition-all duration-300">
        {/* Nút Zalo */}
        <motion.a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={hoverEffect}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm transition-all"
          title="Chat Zalo với chúng tôi"
        >
          <img
            src="/icon/Zalo.webp"
            alt="Zalo"
            className="h-9 w-9 object-contain"
          />
        </motion.a>

        {/* Nút Facebook / Messenger */}
        <motion.a
          href={fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={hoverEffect}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm transition-all"
          title="Liên hệ Facebook"
        >
          <img
            src="/icon/Facebook.webp"
            alt="Facebook"
            className="h-9 w-9 object-contain"
          />
        </motion.a>

        {/* Nút Hotline Điện thoại */}
        <motion.a
          href={`tel:${phone}`}
          whileHover={hoverEffect}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm transition-all"
          title="Gọi hotline đặt bàn"
        >
          <img
            src="/icon/Phone.webp"
            alt="Hotline"
            className="h-9 w-9 object-contain"
          />
        </motion.a>
      </div>
    </div>
  );
};

export default FloatingContact;
