import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ViewImages from "./components/ViewImages";
import UploadImages from "./components/UploadImages";
import ViewPosts from "./components/ViewPosts";
import WritePost from "./components/WritePost";
import ManageContacts from "./components/ManageContacts";

// MOCK DATA CHO DASHBOARD
const MOCK_GALLERY = [
  { id: 1, url: "/images/about/bg.png", category: "space", title: "Không gian sảnh chính" },
  { id: 2, url: "/images/home/food-1.png", category: "food", title: "Tôm hùm Cam Ranh sốt bơ tỏi" },
  { id: 3, url: "/images/about/phucvu.webp", category: "event", title: "Tiệc ngoài trời bên bờ vịnh" },
];

const MOCK_NEWS = [
  { id: 1, title: "NS Bến Thuyền - Grand Re-Opening: Hành Trình Mới, Trải Nghiệm Mới", category: "su-kien", date: "15/06/2026", isPublished: true },
  { id: 2, title: "Khám Phá Hương Vị Hải Sản Thượng Hạng Tại Vịnh Cam Ranh", category: "am-thuc", date: "10/06/2026", isPublished: true },
  { id: 3, title: "Xu Hướng Tổ Chức Tiệc Ngoài Trời Bên Bờ Vịnh Năm 2026", category: "dich-vu", date: "05/06/2026", isPublished: false },
];

const MOCK_CONTACTS = [
  { id: 1, name: "Nguyễn Văn A", phone: "0901234567", email: "vana@gmail.com", message: "Tôi muốn đặt bàn tiệc sinh nhật cho 15 người vào tối thứ 7 tuần này hướng vịnh.", status: "pending", date: "16/06/2026 21:05", note: "" },
  { id: 2, name: "Trần Thị B", phone: "0912345678", email: "thib@gmail.com", message: "Món cá mú đỏ sốt Hong Kong của nhà hàng rất ngon, dịch vụ phục vụ rất chuyên nghiệp. Sẽ quay lại!", status: "completed", date: "15/06/2026 18:30", note: "Đã liên hệ cảm ơn khách" },
  { id: 3, name: "Phạm Văn C", phone: "0987654321", email: "", message: "Cho tôi hỏi bên mình có phòng VIP riêng tư cho 8 người không và chi phí tối thiểu là bao nhiêu?", status: "pending", date: "14/06/2026 10:15", note: "" },
];

export const AdminDashboard = () => {
  // Quản lý view hiện tại
  const [currentView, setCurrentView] = useState("view-posts");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // State các bộ lọc
  const [searchPost, setSearchPost] = useState("");
  const [postCategoryFilter, setPostCategoryFilter] = useState("all");

  const [searchContact, setSearchContact] = useState("");
  const [contactStatusFilter, setContactStatusFilter] = useState("all");

  const [imageCategoryFilter, setImageCategoryFilter] = useState("all");

  // State dữ liệu tương tác
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [gallery, setGallery] = useState(MOCK_GALLERY);
  const [posts, setPosts] = useState(MOCK_NEWS);

  // Toggle trạng thái xử lý liên hệ
  const handleToggleContactStatus = (id, newStatus) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  // Cập nhật ghi chú nội bộ liên hệ
  const handleUpdateContactNote = (id, noteVal) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, note: noteVal } : c));
  };

  // Xóa bài viết
  const handleDeletePost = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Xóa ảnh
  const handleDeleteImage = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hình ảnh này không?")) {
      setGallery(prev => prev.filter(img => img.id !== id));
    }
  };

  // Đếm số liên hệ chưa xử lý
  const pendingContactsCount = contacts.filter(c => c.status === "pending").length;

  return (
    <div className="flex h-screen w-full bg-[#FAF9F5] overflow-hidden font-sans">

      {/* SIDEBAR BÊN TRÁI */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        pendingContactsCount={pendingContactsCount}
      />

      {/* CONTENT AREA BÊN PHẢI */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP HEADER */}
        <Header
          currentView={currentView}
          setSidebarOpen={setSidebarOpen}
        />

        {/* CONTAINER CHÍNH CHỨA VIEW NỘI DUNG */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">

          {/* 1. View Xem hình ảnh */}
          {currentView === "view-images" && (
            <ViewImages
              gallery={gallery}
              imageCategoryFilter={imageCategoryFilter}
              setImageCategoryFilter={setImageCategoryFilter}
              setCurrentView={setCurrentView}
              handleDeleteImage={handleDeleteImage}
            />
          )}

          {/* 2. View Đăng hình ảnh */}
          {currentView === "upload-images" && (
            <UploadImages
              setCurrentView={setCurrentView}
              setGallery={setGallery}
            />
          )}

          {/* 3. View Xem bài viết */}
          {currentView === "view-posts" && (
            <ViewPosts
              posts={posts}
              postCategoryFilter={postCategoryFilter}
              setPostCategoryFilter={setPostCategoryFilter}
              searchPost={searchPost}
              setSearchPost={setSearchPost}
              setCurrentView={setCurrentView}
              handleDeletePost={handleDeletePost}
            />
          )}

          {/* 4. View Đăng bài viết */}
          {currentView === "write-post" && (
            <WritePost
              setCurrentView={setCurrentView}
              setPosts={setPosts}
            />
          )}

          {/* 5. View Quản lý liên hệ */}
          {currentView === "manage-contacts" && (
            <ManageContacts
              contacts={contacts}
              contactStatusFilter={contactStatusFilter}
              setContactStatusFilter={setContactStatusFilter}
              searchContact={searchContact}
              setSearchContact={setSearchContact}
              handleToggleContactStatus={handleToggleContactStatus}
              handleUpdateContactNote={handleUpdateContactNote}
            />
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
