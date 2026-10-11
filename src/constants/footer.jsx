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
  { label: "Facebook NS Bến Thuyền", icon: <FaFacebookF />, href: "https://www.facebook.com/nsbenthuyen" },
  { label: "Instagram NS Bến Thuyền", icon: <FaInstagram />, href: "https://www.instagram.com/nsbenthuyen" },
  { label: "Gửi Email cho NS Bến Thuyền", icon: <IoMailOutline />, href: "mailto:nsbenthuyen@gmail.com" },
];
