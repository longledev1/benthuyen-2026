import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import { postService } from "../../services/postService";
import { postSchema } from "../../validation/postValidation";
import PostForm from "./components/ManagePosts/PostForm";

export const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setPosts, showToast } = useOutletContext();

  const [postData, setPostData] = useState({
    title: "",
    slug: "",
    category: "su-kien",
    excerpt: "",
    content: "",
    isPublished: true,
    author: "Quản trị viên",
    cover_image_url: null,
    cover_image_storage_path: null,
  });

  const [oldCoverStoragePath, setOldCoverStoragePath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Tải dữ liệu bài viết cũ cần chỉnh sửa
  useEffect(() => {
    const loadPostData = async () => {
      setLoading(true);
      try {
        const oldPost = await postService.fetchPostById(id);
        if (oldPost) {
          setPostData({
            title: oldPost.title || "",
            slug: oldPost.slug || "",
            category: oldPost.category || "su-kien",
            excerpt: oldPost.excerpt || "",
            content: oldPost.content || "",
            isPublished: oldPost.isPublished,
            author: oldPost.author || "Quản trị viên",
            cover_image_url: oldPost.cover_image_url || null,
            cover_image_storage_path: oldPost.cover_image_storage_path || null,
          });
          setOldCoverStoragePath(oldPost.cover_image_storage_path || null);
        } else {
          showToast("Không tìm thấy bài viết cần chỉnh sửa!", "error");
          navigate("/domdom/posts");
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu bài viết chỉnh sửa:", err);
        showToast("Đã xảy ra lỗi khi tải dữ liệu bài viết.", "error");
        navigate("/domdom/posts");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPostData();
    }
  }, [id, navigate, showToast]);

  // Submit cập nhật bài viết
  const handleSaveSubmit = async (e, coverFile) => {
    setValidationError("");

    // Validate bài viết bằng Zod schema
    const validation = postSchema.safeParse({
      title: postData.title,
      slug: postData.slug,
      category: postData.category,
      excerpt: postData.excerpt,
      content: postData.content,
      isPublished: postData.isPublished,
      author: postData.author,
    });

    if (!validation.success) {
      setValidationError(validation.error.issues[0].message);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSaving(true);

    try {
      const updatedPost = await postService.updatePost(
        id,
        postData,
        coverFile,
        oldCoverStoragePath,
      );

      if (updatedPost) {
        setPosts((prev) => prev.map((p) => (String(p.id) === String(id) ? updatedPost : p)));
      }

      showToast("Cập nhật bài viết thành công!", "success");
      navigate("/domdom/posts");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật bài viết:", err);
      showToast(
        "Đã xảy ra lỗi khi lưu chỉnh sửa. Chi tiết: " +
          (err.message || "Lỗi lưu DB"),
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center bg-transparent">
        <FiLoader className="text-primary mb-3 animate-spin" size={32} />
        <p className="font-sans text-xs font-semibold tracking-wide text-slate-500">
          ĐANG TẢI THÔNG TIN BÀI VIẾT...
        </p>
      </div>
    );
  }

  return (
    <PostForm
      postData={postData}
      setPostData={setPostData}
      saving={saving}
      validationError={validationError}
      onSubmit={handleSaveSubmit}
      onCancel={() => navigate("/domdom/posts")}
      titleText="Chỉnh sửa bài viết"
      submitButtonText="Lưu thay đổi"
      initialCoverUrl={postData.cover_image_url || ""}
    />
  );
};

export default EditPost;
