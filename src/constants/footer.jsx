import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import {
  IoMailOutline,
  IoCallOutline,
  IoTimeOutline,
  IoLocationOutline,
} from "react-icons/io5";

export const FOOTER_CONTACT = [
  { icon: <IoCallOutline />, content: "Hotline: 0909.886.058" },
  { icon: <IoMailOutline />, content: "Email: nsbenthuyen@gmail.com" },
  {
    icon: <IoLocationOutline />,
    content: "Địa chỉ: 21S-21T Nguyễn Văn Trỗi, P.Phú Nhuận, TP.HCM",
  },
  { icon: <IoTimeOutline />, content: "Giờ mở cửa: 10:00 - 23:00 Hàng ngày" },
];

export const FOOTER_EXPLORE = [
  { name: "Thực đơn Alacarte", href: "/menu" },
  { name: "Không gian VIP", href: "#" },
  { name: "Ưu đãi đặc biệt", href: "#" },
  { name: "Tuyển dụng", href: "#" },
];

export const FOOTER_LEGAL = [
  { name: "Chính sách bảo mật", href: "#" },
  { name: "Điều khoản sử dụng", href: "#" },
];

export const SOCIAL_LINKS = [
  { icon: <FaFacebookF />, href: "https://facebook.com" },
  { icon: <FaInstagram />, href: "https://instagram.com" },
  { icon: <IoMailOutline />, href: "mailto:nsgroup@gmail.com" },
];
