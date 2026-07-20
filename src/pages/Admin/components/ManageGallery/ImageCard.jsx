import React from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import LazyImage from "../../../../components/LazyImage";
import { GALLERY_CATEGORIES } from "../../../../constants/gallery-cate";

export const ImageCard = ({
  img,
  selectedIds,
  handleToggleSelect,
  handleOpenEditModal,
  handleDeleteImage,
}) => {
  const currentCategory = GALLERY_CATEGORIES.find(
    (cat) => cat.value === img.category,
  );

  return (
    <div
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
            className="font-normal line-clamp-2 text-xs leading-relaxed text-slate-400"
            title={img.description || img.desc}
          >
            {img.description || img.desc || "Chưa có mô tả cho ảnh này."}
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
};

export default ImageCard;
