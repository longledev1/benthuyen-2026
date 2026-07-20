import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams, useOutletContext } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { FilterTabs } from "../../components/Form";
import { GALLERY_CATEGORIES } from "../../constants/gallery-cate";
import { galleryService } from "../../services/galleryService";
import Pagination from "../../components/Pagination";

// Sub-components
import ImageCard from "./components/ManageGallery/ImageCard";
import EditImageModal from "./components/ManageGallery/EditImageModal";

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

  // Lọc ảnh bằng useMemo
  const activeImages = useMemo(() => {
    return gallery.filter(
      (img) =>
        imageCategoryFilter === "all" || img.category === imageCategoryFilter,
    );
  }, [gallery, imageCategoryFilter]);

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

  // Tính toán tabs động bằng useMemo
  const dynamicTabs = useMemo(() => {
    return [
      { value: "all", label: "Tất cả ảnh", count: gallery.length },
      ...GALLERY_CATEGORIES.map((cat) => ({
        value: cat.value,
        label: cat.label.replace(" nhà hàng", ""),
        count: gallery.filter((img) => img.category === cat.value).length,
      })),
    ];
  }, [gallery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <FilterTabs
          tabs={dynamicTabs}
          activeTab={imageCategoryFilter}
          onTabChange={handleFilterChange}
        />
        <button
          onClick={() => navigate("/domdom/gallery/upload")}
          className="bg-primary hover:bg-primary/90 flex cursor-pointer items-center space-x-2 rounded-lg px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-sm"
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
          {paginatedImages.map((img) => (
            <ImageCard
              key={img.id}
              img={img}
              selectedIds={selectedIds}
              handleToggleSelect={handleToggleSelect}
              handleOpenEditModal={handleOpenEditModal}
              handleDeleteImage={handleDeleteImage}
            />
          ))}
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
      <EditImageModal
        editingImage={editingImage}
        editError={editError}
        editPreview={editPreview}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editCategory={editCategory}
        setEditCategory={setEditCategory}
        editUpdating={editUpdating}
        handleEditFileChange={handleEditFileChange}
        handleSaveEdit={handleSaveEdit}
        handleCloseEditModal={handleCloseEditModal}
      />
    </div>
  );
};

export default ManageGallery;
