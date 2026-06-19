import { FiImage, FiFileText, FiPhoneCall, FiCalendar } from "react-icons/fi";

export const SIDEBAR_NAV_ITEMS = [
  {
    id: "gallery",
    title: "Quản lý hình ảnh",
    icon: FiImage,
    hasDropdown: true,
    children: [
      { title: "Đăng ảnh", path: "/admin/gallery/upload" },
      { title: "Xem các hình ảnh", path: "/admin/gallery" },
    ],
  },
  {
    id: "posts",
    title: "Quản lý bài viết",
    icon: FiFileText,
    hasDropdown: true,
    children: [
      { title: "Đăng bài", path: "/admin/posts/new" },
      { title: "Xem các bài viết", path: "/admin/posts" },
    ],
  },
  {
    id: "contacts",
    title: "Quản lý liên hệ",
    icon: FiPhoneCall,
    path: "/admin/contacts",
    badgeKey: "pendingContactsCount",
  },
  {
    id: "bookings",
    title: "Quản lý đặt bàn",
    icon: FiCalendar,
    path: "/admin/bookings",
    badgeKey: "pendingBookingsCount",
  },
];

export default SIDEBAR_NAV_ITEMS;
