import React from "react";
import { Link } from "react-router-dom";
import {
  FOOTER_CONTACT,
  FOOTER_EXPLORE,
  FOOTER_LEGAL,
  SOCIAL_LINKS,
} from "../../constants/footer";

const Footer = () => {
  return (
    <footer className="bg-primary-gradient relative overflow-hidden pt-24 pb-12 text-white transition-all duration-500">
      {/* Gold top hairline gradient divider */}
      <div className="via-secondary/30 absolute top-0 left-0 h-[1.5px] w-full bg-gradient-to-r from-transparent to-transparent" />

      {/* Decorative low-opacity watermark in background */}
      <div className="pointer-events-none absolute -bottom-16 -left-16 opacity-[0.15] select-none">
        <img
          src="/images/home/boat2.webp"
          alt="Watermark Sailboat"
          width="320"
          height="462"
          loading="lazy"
          className="h-auto w-80 -scale-x-100 object-contain brightness-0 invert"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Adjusted grid to 12-columns layout for perfect balancing */}
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-12 lg:gap-8">
          {/* CỘT 1: GIỚI THIỆU & SOCIAL (Spans 4 columns) */}
          <div className="flex flex-col space-y-6 md:col-span-6 lg:col-span-4">
            <div className="flex items-center">
              {/* Bigger logo */}
              <img
                src="/logo/nsbenthuyen_white.webp"
                alt="NS Bến Thuyền"
                className="h-16 w-auto object-contain md:h-20"
              />
            </div>
            <p className="max-w-sm text-sm leading-[1.8] font-normal text-white/80">
              Trải nghiệm ẩm thực hải sản thượng lưu giữa lòng thành phố biển.
              Nơi di sản và hương vị đại dương được nâng tầm thành nghệ thuật.
            </p>
            {/* Social Icons with golden hover glow */}
            <div className="flex space-x-3.5 pt-2">
              {SOCIAL_LINKS.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:border-secondary hover:bg-secondary flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white transition-all duration-300 hover:-translate-y-1 hover:text-black hover:shadow-[0_0_15px_rgba(207,178,110,0.4)]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* CỘT 2: LIÊN HỆ (Spans 4 columns due to longer texts) */}
          <div className="flex flex-col space-y-6 md:col-span-6 lg:col-span-4">
            <h3 className="text-secondary font-serif text-base font-semibold tracking-[0.15em] uppercase drop-shadow-[0_0_10px_rgba(207,178,110,0.15)]">
              Liên hệ
            </h3>
            <ul className="space-y-4">
              {FOOTER_CONTACT.map((item, index) => {
                let displayContent = (
                  <span className="text-sm leading-relaxed text-white">
                    {item.content}
                  </span>
                );

                if (item.content.startsWith("Hotline:")) {
                  const phone = item.content.replace("Hotline:", "").trim();
                  displayContent = (
                    <a
                      href={`tel:${phone.replace(/\./g, "")}`}
                      className="hover:text-secondary text-sm leading-relaxed text-white transition-colors duration-300"
                    >
                      {item.content}
                    </a>
                  );
                } else if (item.content.startsWith("Email:")) {
                  const email = item.content.replace("Email:", "").trim();
                  displayContent = (
                    <a
                      href={`mailto:${email}`}
                      className="hover:text-secondary text-sm leading-relaxed text-white transition-colors duration-300"
                    >
                      {item.content}
                    </a>
                  );
                } else if (item.content.startsWith("Địa chỉ:")) {
                  displayContent = (
                    <a
                      href="https://maps.app.goo.gl/baJzsKqt9GsbXwxL6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-secondary text-left text-sm leading-relaxed text-white transition-colors duration-300"
                    >
                      {item.content}
                    </a>
                  );
                }

                return (
                  <li key={index} className="flex items-start space-x-3.5">
                    <span className="mt-0.5 text-lg text-white">
                      {item.icon}
                    </span>
                    {displayContent}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* CỘT 3: KHÁM PHÁ (Spans 2 columns) */}
          <div className="flex flex-col space-y-6 md:col-span-6 lg:col-span-2">
            <h3 className="text-secondary font-serif text-base font-semibold tracking-[0.15em] uppercase drop-shadow-[0_0_10px_rgba(207,178,110,0.15)]">
              Khám phá
            </h3>
            <ul className="space-y-4">
              {FOOTER_EXPLORE.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="group hover:text-secondary flex items-center text-sm font-normal text-white transition-all duration-300 hover:translate-x-1.5"
                  >
                    <span className="w-0 text-xs text-white opacity-0 transition-all duration-300 group-hover:w-4 group-hover:opacity-100">
                      ➔
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CỘT 4: PHÁP LÝ (Spans 2 columns) */}
          <div className="flex flex-col space-y-6 md:col-span-6 lg:col-span-2">
            <h3 className="text-secondary font-serif text-base font-semibold tracking-[0.15em] uppercase drop-shadow-[0_0_10px_rgba(207,178,110,0.15)]">
              Pháp lý
            </h3>
            <ul className="space-y-4">
              {FOOTER_LEGAL.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="group hover:text-secondary flex items-center text-sm font-normal text-white transition-all duration-300 hover:translate-x-1.5"
                  >
                    <span className="w-0 text-xs text-white opacity-0 transition-all duration-300 group-hover:w-4 group-hover:opacity-100">
                      ➔
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="flex flex-col items-center justify-between space-y-4 border-t border-white/5 pt-8 md:flex-row md:space-y-0">
          <p className="text-xs font-normal text-white/50">
            © 2026 NS Bến Thuyền. All rights reserved.
          </p>
          <p className="text-xs font-normal text-white/50">
            Designed and Developed by{" "}
            <a
              href="https://exora.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white/70 transition-colors hover:text-white"
            >
              Exostudio Company Limited
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
