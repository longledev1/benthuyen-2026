import React from "react";

export const FloatingContact = () => {
  const contactChannels = [
    {
      id: "zalo",
      name: "Zalo",
      title: "Chat Zalo với NS Bến Thuyền",
      url: "https://zalo.me/0909886058",
      iconSrc: "/images/icon_zalo.webp",
      waveColor: "rgba(0, 104, 255, 0.45)",
      ringDelay: "0s",
    },
    {
      id: "messenger",
      name: "Messenger",
      title: "Nhắn tin qua Messenger",
      url: "https://m.me/nsbenthuyen",
      iconSrc: "/images/icon_messenger.avif",
      waveColor: "rgba(0, 132, 255, 0.45)",
      ringDelay: "0.4s",
    },
    {
      id: "facebook",
      name: "Facebook",
      title: "Xem Fanpage Facebook",
      url: "https://www.facebook.com/nsbenthuyen",
      iconSrc: "/images/icon_facebook.webp",
      waveColor: "rgba(24, 119, 242, 0.45)",
      ringDelay: "0.8s",
    },
  ];

  return (
    <aside
      aria-label="Liên hệ trực tiếp"
      className="fixed right-3.5 sm:right-5 bottom-5 sm:bottom-7 z-[999] flex flex-col items-center gap-3.5 sm:gap-4 select-none pointer-events-auto"
    >
      {contactChannels.map((item) => (
        <div
          key={item.id}
          className="relative group flex items-center justify-center"
        >
          {/* Lớp sóng tỏa thứ nhất */}
          <span
            className="absolute -inset-1 rounded-full animate-wave-pulse pointer-events-none"
            style={{ backgroundColor: item.waveColor }}
          />

          {/* Lớp sóng tỏa thứ hai (chậm hơn tạo chiều sâu) */}
          <span
            className="absolute -inset-1 rounded-full animate-wave-pulse-delayed pointer-events-none"
            style={{ backgroundColor: item.waveColor }}
          />

          {/* Nút chính có hiệu ứng rung lắc chuông */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={item.title}
            aria-label={item.title}
            className="relative z-10 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.22)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.32)] transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white overflow-hidden"
          >
            <img
              src={item.iconSrc}
              alt={item.name}
              width={52}
              height={52}
              loading="lazy"
              className="h-full w-full object-cover animate-bell-ring transition-transform"
              style={{ animationDelay: item.ringDelay }}
            />
          </a>

          {/* Tooltip phụ hiển thị khi di chuột trên Desktop */}
          <span className="absolute right-full mr-3.5 hidden lg:flex items-center pointer-events-none whitespace-nowrap rounded-lg bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-white tracking-wide opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-1">
            {item.title}
            {/* Mũi tên tooltip nhỏ */}
            <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-900/90" />
          </span>
        </div>
      ))}
    </aside>
  );
};

export default FloatingContact;
