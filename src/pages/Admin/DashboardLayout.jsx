import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { contactService } from "../../services/contactService";
import { galleryService } from "../../services/galleryService";
import { postService } from "../../services/postService";
import { bookingService } from "../../services/bookingService";
import { ConfirmModal, ToastNotification } from "../../components/NotificationModal";
import { motion, AnimatePresence } from "framer-motion";

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Quản lý state dữ liệu toàn cục cho các view quản trị
  const [contacts, setContacts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // States cho hệ thống Modal & Toast toàn cục
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    onConfirm: null
  });
  const [toastList, setToastList] = useState([]);

  const showConfirm = (message, onConfirm, type = "danger", title = "Xác nhận hành động") => {
    setConfirmConfig({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: () => {
        onConfirm();
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToastList(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToastList(prev => prev.filter(t => t.id !== id));
  };

  // Lắng nghe kích thước màn hình để tự động điều chỉnh Sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Khởi tạo ngay lần đầu
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Tải danh sách liên hệ từ Supabase
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await contactService.fetchContacts();
        if (data) {
          setContacts(data);
        } else {
          setContacts([]);
        }
      } catch (err) {
        console.error("⚠️ Lỗi tải danh sách liên hệ từ Supabase:", err);
        setContacts([]);
      } finally {
        setLoadingContacts(false);
      }
    };

    fetchContacts();
  }, []);

  // Tải danh sách đặt bàn từ Supabase
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.fetchBookings();
        if (data) {
          setBookings(data);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error("⚠️ Lỗi tải danh sách đặt bàn từ Supabase:", err);
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  // Tải danh sách hình ảnh từ Supabase
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await galleryService.fetchGallery();
        if (data) {
          setGallery(data);
        } else {
          setGallery([]);
        }
      } catch (err) {
        console.error("⚠️ Lỗi tải ảnh gallery từ Supabase:", err);
        setGallery([]);
      } finally {
        setLoadingGallery(false);
      }
    };

    fetchGallery();
  }, []);

  // Tải danh sách bài viết từ Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.fetchPosts();
        if (data) {
          setPosts(data);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error("⚠️ Lỗi tải bài viết từ Supabase:", err);
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  // Toggle trạng thái xử lý liên hệ
  const handleToggleContactStatus = async (id, newStatus) => {
    const oldContacts = [...contacts];
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    try {
      await contactService.updateContactStatus(id, newStatus);
      showToast("Cập nhật trạng thái liên hệ thành công!", "success");
    } catch (err) {
      console.error("⚠️ Lỗi cập nhật trạng thái liên hệ lên Supabase:", err);
      showToast("Không thể đồng bộ trạng thái lên cơ sở dữ liệu. Vui lòng thử lại!", "error");
      setContacts(oldContacts);
    }
  };

  // Cập nhật ghi chú nội bộ liên hệ
  const handleUpdateContactNote = async (id, noteVal) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, note: noteVal } : c));
    try {
      await contactService.updateContactNote(id, noteVal);
      showToast("Đã lưu ghi chú liên hệ!", "success");
    } catch (err) {
      console.error("⚠️ Lỗi cập nhật ghi chú nội bộ lên Supabase:", err);
      showToast("Không thể lưu ghi chú. Vui lòng thử lại!", "error");
    }
  };

  // Toggle trạng thái xử lý đặt bàn
  const handleToggleBookingStatus = async (id, newStatus) => {
    const oldBookings = [...bookings];
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    try {
      await bookingService.updateBookingStatus(id, newStatus);
      showToast("Cập nhật trạng thái đặt bàn thành công!", "success");
    } catch (err) {
      console.error("⚠️ Lỗi cập nhật trạng thái đặt bàn lên Supabase:", err);
      showToast("Không thể đồng bộ trạng thái lên cơ sở dữ liệu. Vui lòng thử lại!", "error");
      setBookings(oldBookings);
    }
  };

  // Cập nhật ghi chú nội bộ đặt bàn
  const handleUpdateBookingNote = async (id, noteVal) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, note: noteVal } : b));
    try {
      await bookingService.updateBookingNote(id, noteVal);
      showToast("Đã lưu ghi chú đặt bàn!", "success");
    } catch (err) {
      console.error("⚠️ Lỗi cập nhật ghi chú đặt bàn lên Supabase:", err);
      showToast("Không thể lưu ghi chú. Vui lòng thử lại!", "error");
    }
  };

  // Xóa bài viết sử dụng Custom Confirm/Toast
  const handleDeletePost = (id) => {
    const postToDelete = posts.find(p => p.id === id);
    if (!postToDelete) return;

    showConfirm(
      `Bạn có chắc chắn muốn xóa bài viết "${postToDelete.title}" không? Hành động này không thể hoàn tác.`,
      async () => {
        setPosts(prev => prev.filter(p => p.id !== id));
        try {
          await postService.deletePost(id, postToDelete.cover_image_storage_path);
          showToast("Xóa bài viết thành công!", "success");
        } catch (err) {
          console.error("❌ Lỗi xóa bài viết:", err);
          showToast("Không thể xóa bài viết trên hệ thống. Vui lòng thử lại!", "error");
          const data = await postService.fetchPosts();
          setPosts(data);
        }
      },
      "danger",
      "Xóa bài viết"
    );
  };

  // Xóa ảnh sử dụng Custom Confirm/Toast
  const handleDeleteImage = (id) => {
    const imgToDelete = gallery.find(img => img.id === id);
    if (!imgToDelete) return;

    showConfirm(
      `Bạn có chắc chắn muốn xóa hình ảnh "${imgToDelete.title}" không? Hành động này không thể hoàn tác.`,
      async () => {
        setGallery(prev => prev.filter(img => img.id !== id));
        try {
          await galleryService.deleteImage(id, imgToDelete.storage_path);
          showToast("Xóa hình ảnh thành công!", "success");
        } catch (err) {
          console.error("❌ Lỗi xóa hình ảnh:", err);
          showToast("Không thể xóa hình ảnh trên hệ thống. Vui lòng thử lại!", "error");
          const data = await galleryService.fetchGallery();
          setGallery(data);
        }
      },
      "danger",
      "Xóa hình ảnh"
    );
  };

  // Xóa nhiều ảnh sử dụng Custom Confirm/Toast
  const handleDeleteMultipleImages = (ids, storagePaths) => {
    if (!ids || ids.length === 0) return;

    showConfirm(
      `Bạn có chắc chắn muốn xóa ${ids.length} hình ảnh đã chọn không? Hành động này không thể hoàn tác.`,
      async () => {
        setGallery(prev => prev.filter(img => !ids.includes(img.id)));
        try {
          await galleryService.deleteMultipleImages(ids, storagePaths);
          showToast(`Đã xóa thành công ${ids.length} hình ảnh!`, "success");
        } catch (err) {
          console.error("❌ Lỗi xóa hàng loạt hình ảnh:", err);
          showToast("Không thể hoàn tất việc xóa hàng loạt. Vui lòng thử lại!", "error");
          const data = await galleryService.fetchGallery();
          setGallery(data);
        }
      },
      "danger",
      "Xóa nhiều hình ảnh"
    );
  };

  // Đếm số liên hệ chưa xử lý để báo badge đỏ
  const pendingContactsCount = contacts.filter(c => c.status === "pending").length;
  const pendingBookingsCount = bookings.filter(b => b.status === "pending").length;

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      {/* Backdrop overlay cho mobile/tablet khi Sidebar mở */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR BÊN TRÁI */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        pendingContactsCount={pendingContactsCount}
        pendingBookingsCount={pendingBookingsCount}
      />

      {/* CONTENT AREA BÊN PHẢI */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP HEADER */}
        <Header
          setSidebarOpen={setSidebarOpen}
        />

        {/* CONTAINER CHÍNH CHỨA OUTLET ROUTER CON */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet
            context={{
              gallery,
              setGallery,
              posts,
              setPosts,
              contacts,
              setContacts,
              bookings,
              setBookings,
              handleDeleteImage,
              handleDeleteMultipleImages,
              handleDeletePost,
              handleToggleContactStatus,
              handleUpdateContactNote,
              handleToggleBookingStatus,
              handleUpdateBookingNote,
              showConfirm,
              showToast
            }}
          />
        </main>
      </div>

      {/* Global Confirm Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Global Toast Container */}
      <div className="fixed top-6 right-6 z-[200] space-y-3 pointer-events-none">
        <AnimatePresence>
          {toastList.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <ToastNotification
                message={toast.message}
                type={toast.type}
                onClose={() => removeToast(toast.id)}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardLayout;
