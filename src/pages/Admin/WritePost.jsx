import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { postService } from "../../services/postService";
import { postSchema } from "../../validation/postValidation";
import PostForm from "./components/ManagePosts/PostForm";

export const WritePost = () => {
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
  });

  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSaveSubmit = async (e, coverFile) => {
    setValidationError("");

    // Sử dụng Zod để validate bài viết
    const validation = postSchema.safeParse(postData);
    if (!validation.success) {
      setValidationError(validation.error.issues[0].message);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSaving(true);

    try {
      // Gọi service xử lý upload ảnh bìa và tạo record
      const createdPost = await postService.createPost(postData, coverFile);

      if (createdPost) {
        setPosts((prev) => [createdPost, ...prev]);
      }

      showToast("Lưu và xuất bản bài viết thành công!", "success");
      navigate("/domdom/posts");
    } catch (err) {
      console.error("❌ Lỗi khi đăng bài viết:", err);
      showToast(
        "Đã xảy ra lỗi khi đăng bài viết. Chi tiết: " +
          (err.message || "Lỗi lưu DB"),
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <PostForm
      postData={postData}
      setPostData={setPostData}
      saving={saving}
      validationError={validationError}
      onSubmit={handleSaveSubmit}
      onCancel={() => navigate("/domdom/posts")}
      titleText="Soạn thảo nội dung bài viết"
      submitButtonText="Lưu & Xuất Bản"
    />
  );
};

export default WritePost;
