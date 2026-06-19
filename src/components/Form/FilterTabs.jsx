import React from "react";

/**
 * FilterTabs Component - Bộ lọc dạng các nút Tab bấm ngang
 * Cực kỳ trực quan, chữ to rõ ràng, thích hợp cho người lớn tuổi dễ thao tác
 *
 * @param {Array} tabs - Danh sách tab: [{ value: 'all', label: 'Tất cả', count: 12 }]
 * @param {string} activeTab - Giá trị của tab đang được chọn
 * @param {function} onTabChange - Callback khi click đổi tab
 */
export const FilterTabs = ({
  tabs = [],
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange?.(tab.value)}
            className={`flex cursor-pointer items-center space-x-2 rounded-lg px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
              isActive
                ? "bg-primary shadow-primary/10 scale-100 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
            }`}
          >
            <span>{tab.label}</span>

            {/* Hiển thị số đếm (Badge) nếu có truyền vào */}
            {tab.count !== undefined && (
              <span
                className={`ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                  isActive
                    ? "bg-secondary text-[#0F1524]"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
