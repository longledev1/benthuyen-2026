import React from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FilterTabs, SearchInput } from "../../../components/Form";

export const ViewPosts = ({
  posts = [],
  postCategoryFilter,
  setPostCategoryFilter,
  searchPost,
  setSearchPost,
  setCurrentView,
  handleDeletePost,
}) => {
  return (
    <div className="space-y-6">
      {/* Lọc và Tìm kiếm bài viết */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
        <FilterTabs
          tabs={[
            { value: "all", label: "Tất cả bài viết", count: posts.length },
            {
              value: "su-kien",
              label: "Sự kiện",
              count: posts.filter((p) => p.category === "su-kien").length,
            },
            {
              value: "am-thuc",
              label: "Ẩm thực",
              count: posts.filter((p) => p.category === "am-thuc").length,
            },
            {
              value: "dich-vu",
              label: "Dịch vụ",
              count: posts.filter((p) => p.category === "dich-vu").length,
            },
          ]}
          activeTab={postCategoryFilter}
          onTabChange={setPostCategoryFilter}
        />

        <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
          <SearchInput
            value={searchPost}
            onChange={(e) => setSearchPost(e.target.value)}
            onClear={() => setSearchPost("")}
            placeholder="Tìm tiêu đề bài viết..."
          />
          <button
            onClick={() => setCurrentView("write-post")}
            className="flex cursor-pointer items-center space-x-2 rounded-lg px-4 py-2.5 text-xs font-bold tracking-wider whitespace-nowrap text-white uppercase shadow-sm"
          >
            <FiPlus size={16} />
            <span>Đăng bài mới</span>
          </button>
        </div>
      </div>

      {/* Bảng danh sách bài viết */}
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 font-sans text-[10px] tracking-widest text-slate-500 uppercase">
                <th className="px-6 py-4">Tiêu đề bài viết</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Ngày đăng</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {posts
                .filter(
                  (p) =>
                    postCategoryFilter === "all" ||
                    p.category === postCategoryFilter,
                )
                .filter(
                  (p) =>
                    searchPost.trim() === "" ||
                    p.title.toLowerCase().includes(searchPost.toLowerCase()),
                )
                .map((p) => (
                  <tr
                    key={p.id}
                    className="transition-colors hover:bg-slate-50/50"
                  >
                    <td className="max-w-sm truncate px-6 py-4 font-semibold text-slate-800">
                      {p.title}
                    </td>
                    <td className="text-secondary px-6 py-4 text-xs tracking-wider uppercase">
                      {p.category === "su-kien" && "Sự kiện"}
                      {p.category === "am-thuc" && "Ẩm thực"}
                      {p.category === "dich-vu" && "Dịch vụ"}
                    </td>
                    <td className="px-6 py-4 font-sans text-xs text-slate-500">
                      {p.date}
                    </td>
                    <td className="px-6 py-4">
                      {p.isPublished ? (
                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
                          Công khai
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                          Bản nháp
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/news/${p.id}`}
                          target="_blank"
                          className="hover:bg-primary flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-all hover:text-white"
                          title="Xem bài viết trên web"
                        >
                          <FiEye size={13} />
                        </Link>
                        <button
                          onClick={() => {
                            alert("Tính năng chỉnh sửa bài viết đang tải...");
                          }}
                          className="hover:bg-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-all hover:text-white"
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(p.id)}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition-all hover:bg-rose-500 hover:text-white"
                          title="Xóa"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewPosts;
