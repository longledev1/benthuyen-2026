import React, { useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  FiUploadCloud,
  FiTrash2,
  FiLoader,
  FiCheckCircle,
} from "react-icons/fi";
import { TextField, Select } from "../../components/Form";
import { galleryService } from "../../services/galleryService";
import { galleryUploadSchema } from "../../validation/galleryValidation";
import { GALLERY_CATEGORIES } from "../../constants/gallery-cate";

export const UploadImages = () => {
  const navigate = useNavigate();
  const { setGallery, showToast } = useOutletContext();
  const fileInputRef = useRef(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  // Khởi tạo mặc định bằng phần tử đầu tiên trong mảng constant thay vì hardcode "space"
  const [category, setCategory] = useState(
    GALLERY_CATEGORIES[0]?.value || "history",
  );
  const [commonTitle, setCommonTitle] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Xử lý khi chọn file từ máy tính
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToList(e.target.files);
    }
  };

  // Thêm file vào danh sách state kèm theo URL preview và chú thích mặc định
  const addFilesToList = (files) => {
    const newFiles = Array.from(files).map((file) => {
      const cleanName =
        file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      return {
        id: `${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2), // MB
        preview: URL.createObjectURL(file),
        title: cleanName, // mặc định lấy tên file sạch làm chú thích riêng
        progress: 0,
        status: "pending", // pending, compressing, uploading, success, error
        errorMsg: "",
      };
    });

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  // Xóa ảnh ra khỏi danh sách chọn trước khi upload
  const removeFile = (id) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  // Kéo thả file
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToList(e.dataTransfer.files);
    }
  };

  // Nhấp vào khung để mở cửa sổ chọn file
  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  // Thực thi nén và upload hàng loạt
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    // Kiểm tra tính hợp lệ qua Zod Schema
    const validation = galleryUploadSchema.safeParse({
      category,
      title: commonTitle,
      filesCount: selectedFiles.length,
    });

    if (!validation.success) {
      setValidationError(validation.error.issues[0].message);
      return;
    }

    setUploading(true);

    // Tạo bản sao danh sách để cập nhật trạng thái tiến trình
    let filesState = [...selectedFiles];
    const uploadedRecords = [];

    for (let i = 0; i < filesState.length; i++) {
      const current = filesState[i];

      try {
        // Callback cập nhật tiến độ
        const onStatusChange = (status, progress, errorMsg) => {
          setSelectedFiles((prev) =>
            prev.map((f) =>
              f.id === current.id
                ? { ...f, status, progress, errorMsg: errorMsg || "" }
                : f,
            ),
          );
        };

        const dbRecord = await galleryService.uploadImage(
          current.file,
          category,
          current.title.trim() || current.name,
          onStatusChange,
        );

        if (dbRecord) {
          uploadedRecords.push(dbRecord);
        }
      } catch (err) {
        console.error(`❌ Lỗi xử lý file ${current.name}:`, err);
        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === current.id
              ? {
                  ...f,
                  status: "error",
                  errorMsg: err.message || "Lỗi tải lên",
                }
              : f,
          ),
        );
      }
    }

    // Đẩy dữ liệu mới lên state Layout Admin
    if (uploadedRecords.length > 0) {
      setGallery((prev) => [...uploadedRecords, ...prev]);
    }

    setUploading(false);

    // Kiểm tra xem có file nào bị lỗi không
    const errorsCount = selectedFiles.filter(
      (f) => f.status === "error",
    ).length;
    if (errorsCount === 0) {
      showToast(
        `Đăng tải thành công ${selectedFiles.length} hình ảnh!`,
        "success",
      );
      navigate("/domdom/gallery");
    } else {
      showToast(
        `Đã hoàn tất! Thành công: ${uploadedRecords.length}, Thất bại: ${errorsCount}. Vui lòng kiểm tra lại ảnh báo đỏ.`,
        "error",
      );
    }
  };

  return (
    <div className="w-full rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
      <h3 className="text-primary mb-6 border-b border-slate-100 pb-2 font-sans text-xl font-bold">
        Tải hình ảnh mới lên thư viện
      </h3>

      <form onSubmit={handleUploadSubmit} className="space-y-6">
        {/* Khung hiển thị thông báo lỗi Zod */}
        {validationError && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-600">
            ⚠️ {validationError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Chọn danh mục - Đã map tự động theo constant */}
          <Select
            name="category"
            label="Danh mục hình ảnh"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={uploading}
            options={GALLERY_CATEGORIES}
          />

          {/* Nhập chú thích ảnh chung và áp dụng nhanh cho tất cả */}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <TextField
                name="title"
                label="Chú thích hình ảnh chung"
                placeholder="Ví dụ: Không gian ban đêm bên vịnh..."
                value={commonTitle}
                onChange={(e) => setCommonTitle(e.target.value)}
                disabled={uploading}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!commonTitle.trim()) return;
                setSelectedFiles((prev) =>
                  prev.map((f) => ({ ...f, title: commonTitle.trim() })),
                );
              }}
              disabled={uploading || selectedFiles.length === 0}
              className="mb-[2px] h-[42px] cursor-pointer rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200 disabled:pointer-events-none disabled:opacity-50"
            >
              Áp dụng
            </button>
          </div>
        </div>

        {/* Khung kéo thả file */}
        <div className="flex w-full flex-col space-y-1.5">
          <label className="text-primary text-xs font-semibold tracking-wide uppercase">
            Chọn tệp hình ảnh <span className="text-rose-500">*</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 transition-all ${
              dragActive
                ? "bg-primary/5 border-primary"
                : "hover:border-primary border-slate-300 bg-slate-50 hover:bg-slate-100/50"
            } ${uploading ? "pointer-events-none opacity-50" : ""}`}
          >
            <FiUploadCloud size={44} className="mb-3 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">
              Kéo thả các tệp vào đây hoặc nhấn để chọn
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Hỗ trợ tất cả định dạng ảnh. Tự động nén WebP trước khi tải lên.
            </p>
          </div>
        </div>

        {/* Danh sách ảnh xem trước & trạng thái tiến trình */}
        {selectedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Danh sách ảnh đã chọn ({selectedFiles.length})
              </h4>
              {!uploading && (
                <button
                  type="button"
                  onClick={() => setSelectedFiles([])}
                  className="cursor-pointer text-xs font-semibold text-rose-500 hover:underline"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            <div className="grid max-h-[450px] grid-cols-1 gap-4 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {selectedFiles.map((fileItem) => (
                <div
                  key={fileItem.id}
                  className="group relative flex items-center rounded-lg border border-slate-200/80 bg-white p-3 shadow-xs"
                >
                  {/* Thumbnail */}
                  <img
                    src={fileItem.preview}
                    alt="preview"
                    className="mr-3 h-12 w-12 rounded-md border border-slate-100 object-cover"
                  />

                  {/* Info */}
                  <div className="min-w-0 flex-1 pr-4">
                    <p
                      className="truncate text-xs font-semibold text-slate-700"
                      title={fileItem.name}
                    >
                      {fileItem.name}
                    </p>
                    <p className="mb-1 text-[10px] text-slate-400">
                      {fileItem.size} MB
                    </p>

                    {/* Ô nhập chú thích riêng cho từng ảnh */}
                    <input
                      type="text"
                      value={fileItem.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedFiles((prev) =>
                          prev.map((f) =>
                            f.id === fileItem.id ? { ...f, title: val } : f,
                          ),
                        );
                      }}
                      placeholder="Chú thích riêng..."
                      disabled={uploading}
                      className="focus:border-primary w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] focus:bg-white focus:outline-none"
                    />

                    {/* Tiến độ tải lên */}
                    {fileItem.status !== "pending" && (
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-350 ${
                            fileItem.status === "error"
                              ? "bg-rose-500"
                              : fileItem.status === "success"
                                ? "bg-emerald-500"
                                : "bg-primary"
                          }`}
                          style={{ width: `${fileItem.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Icon trạng thái / Nút xóa */}
                  <div className="flex items-center">
                    {fileItem.status === "pending" && !uploading && (
                      <button
                        type="button"
                        onClick={() => removeFile(fileItem.id)}
                        className="cursor-pointer p-1 text-slate-400 transition-colors hover:text-rose-500"
                        title="Xóa ảnh"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                    {fileItem.status === "compressing" && (
                      <span
                        className="flex items-center text-[10px] font-bold text-amber-500"
                        title="Đang nén ảnh..."
                      >
                        <FiLoader className="mr-1 animate-spin" size={12} />
                        Nén...
                      </span>
                    )}
                    {fileItem.status === "uploading" && (
                      <span
                        className="text-primary flex items-center text-[10px] font-bold"
                        title="Đang tải lên..."
                      >
                        <FiLoader className="mr-1 animate-spin" size={12} />
                        Gửi...
                      </span>
                    )}
                    {fileItem.status === "success" && (
                      <span
                        className="text-emerald-500"
                        title="Tải lên thành công"
                      >
                        <FiCheckCircle size={16} />
                      </span>
                    )}
                    {fileItem.status === "error" && (
                      <span
                        className="text-[10px] font-bold text-rose-500"
                        title={fileItem.errorMsg}
                      >
                        Lỗi!
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nút gửi */}
        <div className="flex space-x-4 border-t border-slate-100 pt-4">
          <button
            type="submit"
            disabled={uploading || selectedFiles.length === 0}
            className="bg-primary hover:bg-primary/90 flex flex-1 cursor-pointer items-center justify-center space-x-2 rounded-lg py-3.5 text-xs font-bold tracking-widest text-white uppercase shadow-md transition-all disabled:pointer-events-none disabled:opacity-50"
          >
            {uploading ? (
              <>
                <FiLoader className="animate-spin" size={14} />
                <span>Đang xử lý tải lên...</span>
              </>
            ) : (
              <span>Bắt đầu đăng tải ({selectedFiles.length} ảnh)</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/domdom/gallery")}
            disabled={uploading}
            className="cursor-pointer rounded-lg border border-slate-300 px-6 text-xs font-bold tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-50 disabled:opacity-50"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadImages;
