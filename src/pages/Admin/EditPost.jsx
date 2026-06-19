import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import {
  FiImage,
  FiUploadCloud,
  FiTrash2,
  FiLoader,
  FiChevronLeft,
  FiCalendar,
  FiClock,
  FiUser,
} from "react-icons/fi";
import { TextField, TextArea, Select, Switch } from "../../components/Form";
import { postService } from "../../services/postService";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { QUILL_MODULES, QUILL_FORMATS } from "../../constants/quillConfig";
import { postSchema } from "../../validation/postValidation";

const calculateReadTime = (content) => {
  if (!content) return "1 phút đọc";
  const text = content.replace(/<[^>]*>/g, "");
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} phút đọc`;
};

export const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setPosts, showToast } = useOutletContext();
  const coverInputRef = useRef(null);

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
  const [coverFile, setCoverFile] = useState(null); // null nếu không đổi, File nếu đổi ảnh mới
  const [coverPreview, setCoverPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const quillRef = useRef(null);

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
          if (oldPost.cover_image_url) {
            setCoverPreview(oldPost.cover_image_url);
          }
        } else {
          showToast("Không tìm thấy bài viết cần chỉnh sửa!", "error");
          navigate("/admin/posts");
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu bài viết chỉnh sửa:", err);
        showToast("Đã xảy ra lỗi khi tải dữ liệu bài viết.", "error");
        navigate("/admin/posts");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPostData();
    }
  }, [id, navigate, showToast]);

  // Lắng nghe thay đổi Hash của trình duyệt để đóng/mở Preview
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#preview") {
        setIsPreviewOpen(true);
      } else {
        setIsPreviewOpen(false);
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Xử lý chèn ảnh trong editor
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const publicUrl = await postService.uploadEditorImage(file);

        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        const index = range ? range.index : quill.getLength();
        quill.insertEmbed(index, "image", publicUrl);
        quill.setSelection(index + 1);
      } catch (err) {
        console.error("❌ Lỗi upload ảnh trong Editor:", err);
        showToast(
          `Không thể tải ảnh lên editor. Lỗi: ${err.message || err.error || "Chi tiết trong console."}`,
          "error",
        );
      }
    };
  }, [showToast]);

  // Thiết lập modules Quill động có đính kèm handler
  const modules = useMemo(
    () => ({
      ...QUILL_MODULES,
      toolbar: {
        container: QUILL_MODULES.toolbar,
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler],
  );

  // Xử lý chọn ảnh bìa đại diện mới
  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      if (coverPreview && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Loại bỏ ảnh bìa đại diện
  const handleRemoveCover = () => {
    setCoverFile(null);
    setPostData((prev) => ({
      ...prev,
      cover_image_url: null,
      cover_image_storage_path: null,
    }));
    if (coverPreview && coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverPreview("");
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  // Submit cập nhật bài viết
  const handleSaveSubmit = async (e) => {
    e.preventDefault();
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
        setPosts((prev) => prev.map((p) => (p.id === id ? updatedPost : p)));
      }

      showToast("Cập nhật bài viết thành công!", "success");
      navigate("/admin/posts");
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
    <>
      <form
        onSubmit={handleSaveSubmit}
        className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
      >
        {/* Cột trái (70%): Nội dung chính */}
        <div className="space-y-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8 lg:col-span-8">
          <h3 className="text-primary border-b border-slate-100 pb-2 text-xl font-bold">
            Chỉnh sửa bài viết
          </h3>

          {/* Khung hiển thị lỗi Zod */}
          {validationError && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-600">
              ⚠️ {validationError}
            </div>
          )}

          {/* Tiêu đề bài viết */}
          <TextField
            label="Tiêu đề bài viết"
            placeholder="Ví dụ: Đại Tiệc Hải Sản Cam Ranh Đón Chào Hè 2026..."
            required
            disabled={saving}
            value={postData.title}
            onChange={(e) => {
              const titleVal = e.target.value;
              const slugVal = titleVal
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[đĐ]/g, "d")
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");
              setPostData((prev) => ({
                ...prev,
                title: titleVal,
                slug: slugVal,
              }));
            }}
          />

          {/* Slug đường dẫn */}
          <TextField
            label="Đường dẫn thân thiện (Slug SEO)"
            placeholder="dai-tiec-hai-san-cam-ranh-don-chao-he-2026"
            required
            disabled={saving}
            value={postData.slug}
            onChange={(e) =>
              setPostData((prev) => ({ ...prev, slug: e.target.value }))
            }
          />

          {/* Tóm tắt ngắn */}
          <TextArea
            label="Tóm tắt ngắn (Excerpt)"
            placeholder="Đoạn tóm tắt ngắn khoảng 2-3 câu giới thiệu về nội dung bài viết này..."
            required
            disabled={saving}
            rows={3}
            value={postData.excerpt}
            onChange={(e) =>
              setPostData((prev) => ({ ...prev, excerpt: e.target.value }))
            }
          />

          {/* Khung soạn thảo văn bản */}
          <div className="flex w-full flex-col space-y-1.5">
            <label className="text-primary text-xs font-semibold tracking-wide uppercase">
              Nội dung bài viết (Rich Text Editor){" "}
              <span className="text-rose-500">*</span>
            </label>

            <div className="quill-editor-wrapper">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={postData.content}
                onChange={(value) =>
                  setPostData((prev) => ({ ...prev, content: value }))
                }
                modules={modules}
                formats={QUILL_FORMATS}
                placeholder="Bắt đầu nhập nội dung chi tiết bài viết tại đây..."
                readOnly={saving}
              />
            </div>
          </div>
        </div>

        {/* Cột phải (30%): Cấu hình phụ */}
        <div className="space-y-6 lg:col-span-4">
          {/* Panel 3: Tải ảnh bìa đại diện */}
          <div className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h4 className="text-primary border-b border-slate-100 pb-2 text-base font-bold">
              Ảnh bìa đại diện
            </h4>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
              disabled={saving}
            />

            {coverPreview ? (
              <div className="relative overflow-hidden rounded-lg border border-slate-200">
                <img
                  src={coverPreview}
                  alt="Cover Preview"
                  className="aspect-video w-full object-cover"
                />
                {!saving && (
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="absolute top-2 right-2 cursor-pointer rounded-full bg-rose-500 p-1.5 text-white shadow-md transition-all hover:bg-rose-600"
                    title="Xóa ảnh bìa"
                  >
                    <FiTrash2 size={14} />
                  </button>
                )}
              </div>
            ) : (
              <div
                onClick={() => coverInputRef.current.click()}
                className="hover:border-primary flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-colors hover:bg-slate-100/50"
              >
                <FiUploadCloud size={24} className="mb-2 text-slate-400" />
                <span className="text-xs font-semibold text-slate-700">
                  Tải ảnh bìa lên
                </span>
                <span className="mt-0.5 text-[10px] text-slate-400">
                  Tối ưu kích thước 16:9
                </span>
              </div>
            )}
          </div>

          {/* Panel 2: Thiết lập danh mục & tác giả */}
          <div className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h4 className="text-primary border-b border-slate-100 pb-2 text-base font-bold">
              Thiết lập phân loại
            </h4>

            <Select
              label="Danh mục tin tức"
              required
              value={postData.category}
              disabled={saving}
              onChange={(e) =>
                setPostData((prev) => ({ ...prev, category: e.target.value }))
              }
              options={[
                { value: "su-kien", label: "Sự kiện & Hoạt động" },
                { value: "am-thuc", label: "Ẩm thực tinh hoa" },
                { value: "dich-vu", label: "Dịch vụ tiệc cưới" },
              ]}
            />

            <TextField
              label="Tác giả hiển thị"
              required
              disabled={saving}
              value={postData.author}
              onChange={(e) =>
                setPostData((prev) => ({ ...prev, author: e.target.value }))
              }
            />
          </div>

          {/* Panel 1: Hành động lưu */}
          <div className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h4 className="text-primary border-b border-slate-100 pb-2 text-base font-bold">
              Trạng thái & Lưu bài
            </h4>

            <Switch
              label="Công khai bài viết"
              checked={postData.isPublished}
              disabled={saving}
              onChange={(e) =>
                setPostData((prev) => ({
                  ...prev,
                  isPublished: e.target.checked,
                }))
              }
            />

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary block w-full cursor-pointer rounded-lg py-3.5 text-center text-xs font-bold tracking-widest text-white uppercase shadow-md transition-all hover:bg-[#1f284e] disabled:pointer-events-none disabled:opacity-50"
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <FiLoader className="mr-2 animate-spin" size={14} />
                    Đang lưu bài...
                  </span>
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "preview";
                }}
                disabled={saving}
                className="bg-secondary block w-full cursor-pointer rounded-lg py-3.5 text-center text-xs font-bold tracking-widest text-black uppercase shadow-md transition-all hover:bg-[#bfa25e]"
              >
                Xem trước bài viết
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/posts")}
                disabled={saving}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-3.5 text-center text-xs font-bold tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-100 disabled:opacity-50"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Modal Preview toàn màn hình */}
      {isPreviewOpen && (
        <div className="animate-fadeIn fixed inset-0 z-[120] overflow-y-auto bg-[#FAF9F5] px-4 pt-28 pb-20 md:px-8">
          <button
            type="button"
            onClick={() => {
              window.location.hash = "";
            }}
            className="hover:text-primary text-secondary fixed top-6 left-6 z-[130] flex cursor-pointer items-center space-x-2 rounded-full border border-slate-200/50 bg-white/95 px-5 py-3 text-xs font-bold tracking-[0.2em] uppercase shadow-lg backdrop-blur-xs transition-colors duration-300"
          >
            <FiChevronLeft className="h-4 w-4" />
            <span>Đóng Xem trước</span>
          </button>

          <div className="mx-auto max-w-[1200px]">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              <article className="flex min-w-0 flex-col lg:col-span-8">
                <div className="mb-6">
                  <div className="text-secondary mb-3 flex flex-wrap items-center gap-4 font-sans text-xs tracking-wider uppercase">
                    <span className="bg-primary/5 border-primary/10 text-primary rounded-full border px-3 py-1 font-medium">
                      {postData.category === "su-kien"
                        ? "Sự Kiện"
                        : postData.category === "am-thuc"
                          ? "Ẩm Thực"
                          : "Dịch Vụ"}
                    </span>
                    <span className="flex items-center text-slate-400">
                      <FiCalendar className="mr-1.5" />
                      {new Date().toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center text-slate-400">
                      <FiClock className="mr-1.5" />
                      {calculateReadTime(postData.content)}
                    </span>
                  </div>

                  <h1 className="text-primary mb-4 font-serif text-3xl leading-tight font-normal md:text-5xl md:leading-snug">
                    {postData.title || "Tiêu đề bài viết (Chưa nhập)"}
                  </h1>

                  <div className="flex items-center space-x-3 border-b border-slate-200 pb-6 text-xs text-slate-500">
                    <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
                      <FiUser size={14} />
                    </div>
                    <div>
                      <p className="text-primary font-semibold">
                        {postData.author || "Quản trị viên"}
                      </p>
                      <p className="text-[10px] text-slate-400">Tác giả</p>
                    </div>
                  </div>
                </div>

                {coverPreview && (
                  <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200/80 shadow-md">
                    <img
                      src={coverPreview}
                      alt="Ảnh bìa"
                      className="aspect-video w-full object-cover"
                    />
                  </div>
                )}

                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-10">
                  {postData.excerpt && (
                    <p className="border-secondary mb-8 border-l-2 pl-4 font-sans text-base leading-relaxed font-normal text-slate-600 italic md:text-lg">
                      {postData.excerpt}
                    </p>
                  )}

                  <div
                    className="prose-custom font-normalt space-y-6 text-left font-sans text-sm leading-[1.8] text-slate-700 md:text-base"
                    dangerouslySetInnerHTML={{
                      __html: postData.content
                        ? postData.content
                            .replace(/&nbsp;/g, " ")
                            .replace(/\u00A0/g, " ")
                        : "<p class='text-slate-400 italic'>Nội dung bài viết chưa được nhập...</p>",
                    }}
                  />
                </div>
              </article>

              <aside className="space-y-8 lg:col-span-4">
                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <h4 className="text-primary mb-4 border-b border-slate-100 pb-3 font-serif text-lg font-normal">
                    Về NS Bến Thuyền
                  </h4>
                  <p className="font-normalt mb-4 text-xs leading-relaxed text-slate-500">
                    Tọa lạc tại vịnh Cam Ranh thơ mộng, NS Bến Thuyền là điểm
                    đến ẩm thực hải sản thượng hạng, kết hợp tinh hoa ẩm thực
                    đương đại trong không gian kiến trúc Indochine lãng mạn.
                  </p>
                  <span className="text-secondary text-[10px] font-bold tracking-[0.2em] uppercase">
                    Khám phá ngay ➔
                  </span>
                </div>

                <div className="bg-primary relative overflow-hidden rounded-2xl p-6 text-center text-white shadow-lg">
                  <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/5" />
                  <span className="text-secondary mb-1 block text-[9px] font-semibold tracking-[0.25em] uppercase">
                    Trải Nghiệm Mỹ Vị
                  </span>
                  <h4 className="text-secondary mb-3 font-serif text-2xl font-normal">
                    Đặt Bàn Thưởng Thức
                  </h4>
                  <p className="font-normalt mx-auto mb-6 max-w-[200px] text-xs leading-relaxed text-white/70">
                    Hãy để chúng tôi chuẩn bị một vị trí đẹp nhất hướng vịnh
                    dành riêng cho quý khách.
                  </p>
                  <span className="bg-secondary block rounded-lg py-3.5 text-xs font-bold tracking-[0.2em] text-[#0F1524] uppercase shadow-md">
                    Gọi Ngay: 0901.234.567
                  </span>
                </div>
              </aside>
            </div>
          </div>

          <style>{`
            .prose-custom {
              word-break: normal;
              overflow-wrap: break-word;
              text-align: left !important;
            }
            .prose-custom p,
            .prose-custom span,
            .prose-custom li {
              text-align: left !important;
            }
            .prose-custom img {
              max-width: 100%;
              height: auto;
              border-radius: 0.75rem;
              margin: 1.5rem auto;
              display: block;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
            }
            .prose-custom h2 {
              font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
              font-size: 1.35rem;
              color: #263260;
              font-weight: 500;
              margin-top: 2rem;
              margin-bottom: 1rem;
              line-height: 1.4;
              letter-spacing: 0.02em;
            }
            @media (min-width: 768px) {
              .prose-custom h2 {
                font-size: 1.6rem;
              }
            }
            .prose-custom h3 {
              font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
              font-size: 1.15rem;
              color: #263260;
              font-weight: 500;
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
              line-height: 1.4;
            }
            .prose-custom p {
              margin-bottom: 1.25rem;
            }
            .prose-custom blockquote {
              position: relative;
              border-left: 3px solid #cfb26e;
              padding-left: 1.5rem;
              font-style: italic;
              font-size: 1.05rem;
              color: #475569;
              margin: 2rem 0;
              line-height: 1.6;
            }
            .prose-custom ul {
              list-style-type: none;
              margin: 1.5rem 0;
              padding-left: 0.5rem;
            }
            .prose-custom ul li {
              position: relative;
              padding-left: 1.5rem;
              margin-bottom: 0.75rem;
              font-size: 0.95rem;
            }
            .prose-custom ul li::before {
              content: "•";
              color: #cfb26e;
              font-weight: bold;
              font-size: 1.2rem;
              position: absolute;
              left: 0.25rem;
              top: -0.1rem;
            }
            .prose-custom strong {
              color: #0f172a;
              font-weight: 600;
            }
            .prose-custom em {
              color: #263260;
              font-style: italic;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default EditPost;
