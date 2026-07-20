import React from "react";
import { FiUploadCloud } from "react-icons/fi";
import { TextField, Select } from "../../../components/Form";

export const UploadImages = ({ setCurrentView, setGallery }) => {
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const category = form.category.value;
    const title = form.title.value;

    if (!category) {
      alert("Vui lòng chọn danh mục.");
      return;
    }
    if (!title.trim()) {
      alert("Vui lòng nhập chú thích.");
      return;
    }

    const newImage = {
      id: Date.now(),
      url:
        category === "food"
          ? "/images/home/food-1.png"
          : "/images/about/bg.png",
      category: category,
      title: title,
    };

    setGallery((prev) => [newImage, ...prev]);
    alert("Đăng ảnh thành công (giả lập)!");
    setCurrentView("view-images");
  };

  return (
    <div className="max-w-2xl rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
      <h3 className="text-primary mb-6 border-b border-slate-100 pb-2 font-serif text-lg">
        Tải hình ảnh mới lên thư viện
      </h3>

      <form onSubmit={handleUploadSubmit} className="space-y-6">
        {/* Chọn danh mục */}
        <Select
          name="category"
          label="Danh mục hình ảnh"
          placeholder="-- Chọn danh mục --"
          required
          options={[
            { value: "space", label: "Không gian nhà hàng" },
            { value: "food", label: "Ẩm thực & Món ăn" },
            { value: "event", label: "Tiệc & Sự kiện ngoài trời" },
          ]}
        />

        {/* Nhập chú thích ảnh */}
        <TextField
          name="title"
          label="Chú thích hình ảnh (Hiển thị làm Alt text/Tiêu đề ảnh)"
          placeholder="Ví dụ: Hoàng hôn buông bên bờ vịnh tại sảnh chính..."
          required
        />

        {/* Khung kéo thả file */}
        <div className="flex w-full flex-col space-y-1.5">
          <label className="text-primary text-xs font-semibold tracking-wide uppercase">
            Chọn tệp hình ảnh <span className="text-rose-500">*</span>
          </label>
          <div className="border-slate-350 hover:border-primary flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-slate-50 py-10 transition-colors hover:bg-slate-100/50">
            <FiUploadCloud size={40} className="mb-3 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">
              Kéo thả tệp vào đây hoặc nhấn để chọn
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Hỗ trợ định dạng PNG, JPG, WEBP. Cho phép đăng nhiều ảnh cùng lúc.
            </p>
          </div>
        </div>

        {/* Nút gửi */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 flex-1 cursor-pointer rounded-lg py-3.5 text-xs font-bold tracking-widest text-white uppercase shadow-md transition-all"
          >
            Đăng tải hình ảnh
          </button>
          <button
            type="button"
            onClick={() => setCurrentView("view-images")}
            className="rounded-lg border border-slate-300 px-6 text-xs font-bold tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-50"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadImages;
