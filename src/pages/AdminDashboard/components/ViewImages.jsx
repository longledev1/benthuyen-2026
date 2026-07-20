import React from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { FilterTabs } from "../../../components/Form";

export const ViewImages = ({
  gallery = [],
  imageCategoryFilter,
  setImageCategoryFilter,
  setCurrentView,
  handleDeleteImage,
}) => {
  return (
    <div className="space-y-6">
      {/* Bộ lọc loại ảnh */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <FilterTabs
          tabs={[
            { value: "all", label: "Tất cả ảnh", count: gallery.length },
            {
              value: "space",
              label: "Không gian",
              count: gallery.filter((img) => img.category === "space").length,
            },
            {
              value: "food",
              label: "Ẩm thực",
              count: gallery.filter((img) => img.category === "food").length,
            },
            {
              value: "event",
              label: "Tiệc & Sự kiện",
              count: gallery.filter((img) => img.category === "event").length,
            },
          ]}
          activeTab={imageCategoryFilter}
          onTabChange={setImageCategoryFilter}
        />
        <button
          onClick={() => setCurrentView("upload-images")}
          className="bg-primary hover:bg-primary/90 flex cursor-pointer items-center space-x-2 rounded-lg px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-sm"
        >
          <FiPlus size={16} />
          <span>Đăng ảnh mới</span>
        </button>
      </div>

      {/* Lưới hình ảnh */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {gallery
          .filter(
            (img) =>
              imageCategoryFilter === "all" ||
              img.category === imageCategoryFilter,
          )
          .map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={img.url}
                  alt={img.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="max-w-[150px] truncate text-sm font-semibold text-slate-800">
                    {img.title}
                  </p>
                  <span className="text-secondary text-[10px] font-bold tracking-wider uppercase">
                    {img.category === "space" && "Không gian"}
                    {img.category === "food" && "Ẩm thực"}
                    {img.category === "event" && "Sự kiện"}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition-all hover:bg-rose-500 hover:text-white"
                  title="Xóa hình ảnh"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ViewImages;
