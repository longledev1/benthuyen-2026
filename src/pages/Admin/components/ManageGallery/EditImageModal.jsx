import React from "react";
import { TextField, Select } from "../../../../components/Form";
import { GALLERY_CATEGORIES } from "../../../../constants/gallery-cate";

export const EditImageModal = ({
  editingImage,
  editError,
  editPreview,
  editTitle,
  setEditTitle,
  editCategory,
  setEditCategory,
  editUpdating,
  handleEditFileChange,
  handleSaveEdit,
  handleCloseEditModal,
}) => {
  if (!editingImage) return null;

  return (
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
              className="bg-primary hover:bg-primary/90 flex flex-1 cursor-pointer items-center justify-center space-x-2 rounded-lg py-2.5 text-xs font-bold tracking-widest text-white uppercase transition-all disabled:pointer-events-none disabled:opacity-50"
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
  );
};

export default EditImageModal;
