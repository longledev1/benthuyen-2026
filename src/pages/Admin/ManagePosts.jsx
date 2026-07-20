import React, { useState, useMemo } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { FilterTabs, SearchInput } from "../../components/Form";
import Pagination from "../../components/Pagination";

// Sub-components
import PostTable from "./components/ManagePosts/PostTable";

export const ManagePosts = () => {
  const navigate = useNavigate();
  const { posts, handleDeletePost } = useOutletContext();

  const [searchPost, setSearchPost] = useState("");
  const [postCategoryFilter, setPostCategoryFilter] = useState("all");

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const postsPerPage = 10;

  // Reset trang về 1 khi thay đổi tab lọc
  const handleFilterChange = (newTab) => {
    setPostCategoryFilter(newTab);
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page: 1 });
  };

  // Reset trang về 1 khi gõ tìm kiếm
  const handleSearchChange = (e) => {
    setSearchPost(e.target.value);
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page: 1 });
  };

  // Reset trang về 1 khi xóa ô tìm kiếm
  const handleSearchClear = () => {
    setSearchPost("");
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page: 1 });
  };

  // Tính toán lọc bằng useMemo
  const filteredPosts = useMemo(() => {
    return posts
      .filter(
        (p) => postCategoryFilter === "all" || p.category === postCategoryFilter,
      )
      .filter(
        (p) =>
          searchPost.trim() === "" ||
          p.title.toLowerCase().includes(searchPost.toLowerCase()),
      );
  }, [posts, postCategoryFilter, searchPost]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage,
  );

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
          onTabChange={handleFilterChange}
        />

        <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
          <SearchInput
            value={searchPost}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            placeholder="Tìm tiêu đề bài viết..."
          />
          <button
            onClick={() => navigate("/domdom/posts/new")}
            className="bg-primary hover:bg-primary/90 flex cursor-pointer items-center space-x-2 rounded-lg px-4 py-2.5 text-xs font-bold tracking-wider whitespace-nowrap text-white uppercase shadow-sm"
          >
            <FiPlus size={16} />
            <span>Đăng bài mới</span>
          </button>
        </div>
      </div>

      {/* Bảng danh sách bài viết */}
      <PostTable
        paginatedPosts={paginatedPosts}
        navigate={navigate}
        handleDeletePost={handleDeletePost}
      />

      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          const params = Object.fromEntries(searchParams.entries());
          setSearchParams({ ...params, page });
        }}
      />
    </div>
  );
};

export default ManagePosts;
