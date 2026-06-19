import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import { FilterTabs, TextField, Select } from "../../components/Form";
import { GALLERY_CATEGORIES } from "../../constants/gallery-cate";
import { galleryService } from "../../services/galleryService";
import LazyImage from "../../components/LazyImage";
import Pagination from "../../components/Pagination";

export const ManageGallery = () => {
  const navigate = useNavigate();
  const {
    gallery = [],
    setGallery,
    handleDeleteImage,
    handleDeleteMultipleImages,
    showToast,
  } = useOutletContext();
  const [imageCategoryFilter, setImageCategoryFilter] = useState("all");

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const imagesPerPage = 12;

  // States & logic cho chọn nhiều ảnh xóa hàng loạt
  const [selectedIds, setSelectedIds] = useState([]);

  // Lọc ảnh
  const activeImages = gallery.filter(
    (img) =>
      imageCategoryFilter === "all" || img.category === imageCategoryFilter,
  );

  // Đổi bộ lọc sẽ reset về trang 1
  const handleFilterChange = (newTab) => {
    setImageCategoryFilter(newTab);
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page: 1 });
  };

  const totalPages = Math.ceil(activeImages.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const paginatedImages = activeImages.slice(
    startIndex,
    startIndex + imagesPerPage,
  );

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    const activeIds = activeImages.map((img) => img.id);
    const allSelected = activeIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !activeIds.includes(id)));
    } else {
      setSelectedIds((prev) => {
        const newSelection = [...prev];
        activeIds.forEach((id) => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const pathsToDelete = gallery
      .filter((img) => selectedIds.includes(img.id))
      .map((img) => img.storage_path);

    handleDeleteMultipleImages(selectedIds, pathsToDelete);
    setSelectedIds([]);
  };

  // States cho modal chỉnh sửa ảnh
  const [editingImage, setEditingImage] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("history");
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState("");
  const [editUpdating, setEditUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  const handleOpenEditModal = (img) => {
    setEditingImage(img);
    setEditTitle(img.title);
    setEditCategory(img.category);
    setEditFile(null);
    setEditPreview("");
    setEditError("");
  };

  const handleCloseEditModal = () => {
    setEditingImage(null);
    setEditFile(null);
    if (editPreview) {
      URL.revokeObjectURL(editPreview);
    }
    setEditPreview("");
  };

  const handleEditFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditFile(file);
      if (editPreview) {
        URL.revokeObjectURL(editPreview);
      }
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      setEditError("Chú thích hình ảnh không được để trống!");
      return;
    }

    setEditUpdating(true);
    setEditError("");

    try {
      const updatedImg = await galleryService.updateImage(
        editingImage.id,
        editTitle.trim(),
        editCategory,
        editFile,
        editingImage.storage_path,
      );

      if (updatedImg) {
        setGallery((prev) =>
          prev.map((img) => (img.id === editingImage.id ? updatedImg : img)),
        );
      }

      showToast("Cập nhật hình ảnh thành công!", "success");
      handleCloseEditModal();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật ảnh:", err);
      setEditError(err.message || "Đã xảy ra lỗi khi lưu thay đổi.");
    } finally {
      setEditUpdating(false);
    }
  };

  const dynamicTabs = [
    { value: "all", label: "Tất cả ảnh", count: gallery.length },
    ...GALLERY_CATEGORIES.map((cat) => ({
      value: cat.value,
      label: cat.label.replace(" nhà hàng", ""),
      count: gallery.filter((img) => img.category === cat.value).length,
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <FilterTabs
          tabs={dynamicTabs}
          activeTab={imageCategoryFilter}
          onTabChange={handleFilterChange}
        />
        <button
          onClick={() => navigate("/admin/gallery/upload")}
          className="bg-primary flex cursor-pointer items-center space-x-2 rounded-lg px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-sm hover:bg-[#1f284e]"
        >
          <FiPlus size={16} />
          <span>Đăng ảnh mới</span>
        </button>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-primary text-xs font-bold">
              Đang chọn {selectedIds.length} hình ảnh
            </span>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={handleSelectAll}
              className="hover:text-primary cursor-pointer text-xs font-semibold text-slate-600 transition-colors"
            >
              {activeImages.every((img) => selectedIds.includes(img.id))
                ? "Bỏ chọn tất cả"
                : "Chọn tất cả đang hiển thị"}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50"
            >
              Hủy chọn
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="cursor-pointer rounded-lg bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-rose-600"
            >
              Xóa các ảnh đã chọn ({selectedIds.length})
            </button>
          </div>
        </div>
      )}

      {/* Lưới hình ảnh */}
      {paginatedImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-black/5 bg-white py-16 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-400">
            Chưa có hình ảnh nào được tải lên.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedImages.map((img) => {
            const currentCategory = GALLERY_CATEGORIES.find(
              (cat) => cat.value === img.category,
            );

            return (
              <div
                key={img.id}
                className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md ${
                  selectedIds.includes(img.id)
                    ? "border-secondary ring-secondary/20 ring-2"
                    : "border-black/5"
                }`}
              >
                {/* Image Wrap */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  {/* Custom Checkbox overlay */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelect(img.id);
                    }}
                    className={`absolute top-3 left-3 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border transition-all duration-200 ${
                      selectedIds.includes(img.id)
                        ? "bg-primary border-primary scale-110 text-white shadow-md"
                        : "hover:border-primary border-slate-300 bg-white/80 text-transparent hover:bg-white"
                    }`}
                  >
                    <svg
                      className="h-3 w-3 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <LazyImage
                    src={img.url}
                    alt={img.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div className="space-y-1.5">
                    {/* Badge Category Tag */}
                    <span className="text-secondary inline-block text-[10px] font-bold tracking-wider uppercase">
                      {currentCategory
                        ? currentCategory.label.replace(" nhà hàng", "")
                        : "Khác"}
                    </span>

                    {/* Image Title */}
                    <h4
                      className="line-clamp-1 text-sm font-semibold text-slate-800"
                      title={img.title}
                    >
                      {img.title}
                    </h4>

                    {/* Image Description */}
                    <p
                      className="font-normalt line-clamp-2 text-xs leading-relaxed text-slate-400"
                      title={img.description || img.desc}
                    >
                      {img.description ||
                        img.desc ||
                        "Chưa có mô tả cho ảnh này."}
                    </p>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="mt-4 flex items-center justify-end space-x-2 border-t border-slate-50 pt-3">
                    {/* Nút Sửa Ảnh */}
                    <button
                      onClick={() => handleOpenEditModal(img)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
                      title="Chỉnh sửa hình ảnh"
                      type="button"
                    >
                      <FiEdit2 size={13} />
                    </button>

                    {/* Nút Xóa Ảnh */}
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition-all hover:bg-rose-500 hover:text-white"
                      title="Xóa hình ảnh"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          const params = Object.fromEntries(searchParams.entries());
          setSearchParams({ ...params, page });
        }}
      />

      {/* Modal chỉnh sửa ảnh */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md transform space-y-4 overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-xl transition-all">
            <h3 className="text-primary border-b border-slate-100 pb-2 text-lg font-bold">
              Chỉnh sửa hình ảnh
            </h3>

            {editError && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600">
                ⚠️ {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Vùng xem trước và đổi ảnh */}
              <div className="space-y-1.5">
                <label className="text-primary text-[10px] font-bold tracking-wider uppercase">
                  Hình ảnh hiển thị
                </label>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-inner">
                  <img
                    src={editPreview || editingImage.url}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <label className="absolute right-2 bottom-2 cursor-pointer rounded-lg bg-black/70 px-3 py-1.5 text-[10px] font-bold text-white shadow-md transition-all hover:bg-black/90">
                    Thay ảnh khác
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileChange}
                      className="hidden"
                      disabled={editUpdating}
                    />
                  </label>
                </div>
              </div>

              {/* Chú thích ảnh */}
              <TextField
                label="Chú thích hình ảnh"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Nhập chú thích mới..."
                required
                disabled={editUpdating}
              />

              {/* Danh mục */}
              <Select
                label="Danh mục hình ảnh"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                options={GALLERY_CATEGORIES}
                required
                disabled={editUpdating}
              />

              {/* Nút hành động */}
              <div className="flex space-x-3 border-t border-slate-100 pt-4">
                <button
                  type="submit"
                  disabled={editUpdating}
                  className="bg-primary flex flex-1 cursor-pointer items-center justify-center space-x-2 rounded-lg py-2.5 text-xs font-bold tracking-widest text-white uppercase transition-all hover:bg-[#1f284e] disabled:pointer-events-none disabled:opacity-50"
                >
                  {editUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={editUpdating}
                  className="cursor-pointer rounded-lg border border-slate-300 px-5 py-2.5 text-xs font-bold tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-50 disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGallery;
