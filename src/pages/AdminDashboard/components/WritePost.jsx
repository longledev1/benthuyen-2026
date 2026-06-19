import React, { useState } from "react";
import { FiImage, FiUploadCloud } from "react-icons/fi";
import { TextField, TextArea, Select, Switch } from "../../../components/Form";

export const WritePost = ({ setCurrentView, setPosts }) => {
  const [postData, setPostData] = useState({
    title: "",
    slug: "",
    category: "su-kien",
    excerpt: "",
    content: "",
    isPublished: true,
    author: "Quản trị viên",
  });

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    if (!postData.title.trim()) {
      alert("Vui lòng nhập tiêu đề bài viết.");
      return;
    }

    const createdPost = {
      id: Date.now(),
      title: postData.title,
      category: postData.category,
      date: new Date().toLocaleDateString("vi-VN"),
      isPublished: postData.isPublished,
    };

    setPosts((prev) => [createdPost, ...prev]);
    alert("Lưu bài viết thành công!");
    setCurrentView("view-posts");
  };

  return (
    <form
      onSubmit={handleSaveSubmit}
      className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
    >
      {/* Cột trái (70%): Nội dung chính */}
      <div className="space-y-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8 lg:col-span-8">
        <h3 className="text-primary border-b border-slate-100 pb-2 font-serif text-lg font-normal">
          Soạn thảo nội dung bài viết
        </h3>

        {/* Tiêu đề bài viết */}
        <TextField
          label="Tiêu đề bài viết"
          placeholder="Ví dụ: Đại Tiệc Hải Sản Cam Ranh Đón Chào Hè 2026..."
          required
          value={postData.title}
          onChange={(e) => {
            const titleVal = e.target.value;
            const slugVal = titleVal
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[đĐ]/g, "d")
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-");
            setPostData((prev) => ({
              ...prev,
              title: titleVal,
              slug: slugVal,
            }));
          }}
        />

        {/* Slug đường dẫn */}
        <TextField
          label="Đường dẫn thân thiện (Slug SEO)"
          placeholder="dai-tiec-hai-san-cam-ranh-don-chao-he-2026"
          required
          value={postData.slug}
          onChange={(e) =>
            setPostData((prev) => ({ ...prev, slug: e.target.value }))
          }
        />

        {/* Tóm tắt ngắn */}
        <TextArea
          label="Tóm tắt ngắn (Excerpt)"
          placeholder="Đoạn tóm tắt ngắn khoảng 2-3 câu giới thiệu về nội dung bài viết này..."
          required
          rows={3}
          value={postData.excerpt}
          onChange={(e) =>
            setPostData((prev) => ({ ...prev, excerpt: e.target.value }))
          }
        />

        {/* Khung soạn thảo Rich Text (Giả lập React Quill để visual hóa) */}
        <div className="flex w-full flex-col space-y-1.5">
          <label className="text-primary text-xs font-semibold tracking-wide uppercase">
            Nội dung bài viết (Rich Text Editor){" "}
            <span className="text-rose-500">*</span>
          </label>

          {/* Thanh công cụ giả lập Editor */}
          <div className="flex flex-wrap gap-2 rounded-t-lg border border-b-0 border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <button
              type="button"
              className="rounded px-2 py-0.5 font-bold hover:bg-slate-200"
            >
              B
            </button>
            <button
              type="button"
              className="rounded px-2 py-0.5 italic hover:bg-slate-200"
            >
              I
            </button>
            <button
              type="button"
              className="rounded px-2 py-0.5 underline hover:bg-slate-200"
            >
              U
            </button>
            <div className="mx-1 w-[1px] bg-slate-300" />
            <button
              type="button"
              className="rounded px-2 py-0.5 hover:bg-slate-200"
            >
              H2
            </button>
            <button
              type="button"
              className="rounded px-2 py-0.5 hover:bg-slate-200"
            >
              H3
            </button>
            <button
              type="button"
              className="rounded px-2 py-0.5 hover:bg-slate-200"
            >
              Quote
            </button>
            <div className="mx-1 w-[1px] bg-slate-300" />
            <button
              type="button"
              className="flex items-center space-x-1 rounded px-2 py-0.5 hover:bg-slate-200"
            >
              <FiImage size={14} />
              <span className="text-xs">Ảnh</span>
            </button>
          </div>

          {/* Vùng nhập văn bản */}
          <textarea
            rows={12}
            value={postData.content}
            onChange={(e) =>
              setPostData((prev) => ({ ...prev, content: e.target.value }))
            }
            placeholder="Bắt đầu viết bài viết và kéo thả hình ảnh xen kẽ tại đây..."
            className="focus:ring-primary w-full rounded-b-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:outline-none"
          />
        </div>
      </div>

      {/* Cột phải (30%): Cấu hình phụ */}
      <div className="space-y-6 lg:col-span-4">
        {/* Panel 1: Hành động lưu */}
        <div className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <h4 className="text-primary border-b border-slate-100 pb-2 font-serif text-base font-normal">
            Trạng thái & Đăng bài
          </h4>

          {/* Trạng thái công khai */}
          <Switch
            label="Công khai bài viết lập tức"
            checked={postData.isPublished}
            onChange={(e) =>
              setPostData((prev) => ({
                ...prev,
                isPublished: e.target.checked,
              }))
            }
          />

          {/* Nút gửi */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="bg-primary block w-full cursor-pointer rounded-lg py-3.5 text-center text-xs font-bold tracking-widest text-white uppercase shadow-md transition-all hover:bg-[#1f284e]"
            >
              Lưu & Xuất Bản
            </button>
            <button
              type="button"
              onClick={() => setCurrentView("view-posts")}
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-3.5 text-center text-xs font-bold tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-100"
            >
              Hủy bỏ
            </button>
          </div>
        </div>

        {/* Panel 2: Thiết lập danh mục & tác giả */}
        <div className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <h4 className="text-primary border-b border-slate-100 pb-2 font-serif text-base font-normal">
            Thiết lập phân loại
          </h4>

          {/* Danh mục */}
          <Select
            label="Danh mục tin tức"
            required
            value={postData.category}
            onChange={(e) =>
              setPostData((prev) => ({ ...prev, category: e.target.value }))
            }
            options={[
              { value: "su-kien", label: "Sự kiện & Hoạt động" },
              { value: "am-thuc", label: "Ẩm thực tinh hoa" },
              { value: "dich-vu", label: "Dịch vụ tiệc cưới" },
            ]}
          />

          {/* Tác giả */}
          <TextField
            label="Tác giả hiển thị"
            required
            value={postData.author}
            onChange={(e) =>
              setPostData((prev) => ({ ...prev, author: e.target.value }))
            }
          />
        </div>

        {/* Panel 3: Tải ảnh bìa đại diện */}
        <div className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <h4 className="text-primary border-b border-slate-100 pb-2 font-serif text-base font-normal">
            Ảnh bìa đại diện
          </h4>
          <div className="border-slate-350 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-slate-50 p-4 text-center hover:bg-slate-100/50">
            <FiUploadCloud size={24} className="mb-2 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">
              Tải ảnh bìa lên
            </span>
            <span className="mt-0.5 text-[10px] text-slate-400">
              Tối ưu kích thước 16:9
            </span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default WritePost;
