import supabase from "../lib/supabase";
import { compressToWebP } from "../utils/imageHelper";

// Định dạng thời gian hiển thị tương tự dữ liệu mẫu
const formatDate = (isoString) => {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return isoString;
  }
};

export const postService = {
  /**
   * Lấy toàn bộ danh sách bài viết từ Supabase
   */
  async fetchPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(post => ({
      ...post,
      isPublished: post.is_published, // Map snake_case to camelCase
      date: formatDate(post.created_at)
    }));
  },

  /**
   * Lấy chi tiết một bài viết theo ID
   */
  async fetchPostById(id) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return data ? {
      ...data,
      isPublished: data.is_published,
      date: formatDate(data.created_at)
    } : null;
  },

  /**
   * Lấy chi tiết một bài viết theo Slug
   */
  async fetchPostBySlug(slug) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;

    return data ? {
      ...data,
      isPublished: data.is_published,
      date: formatDate(data.created_at)
    } : null;
  },

  /**
   * Lưu một bài viết mới kèm ảnh bìa
   */
  async createPost(postData, coverFile) {
    let coverUrl = null;
    let coverStoragePath = null;

    // 1. Tải ảnh bìa lên Storage (nếu có)
    if (coverFile) {
      const webpCover = await compressToWebP(coverFile);
      const fileExt = "webp";
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const storagePath = `posts/${uniqueFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(storagePath, webpCover, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) throw uploadError;

      coverStoragePath = storagePath;
      
      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(storagePath);
        
      coverUrl = publicUrl;
    }

    // 2. Lưu vào DB bài viết
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title: postData.title.trim(),
          slug: postData.slug.trim(),
          category: postData.category,
          excerpt: postData.excerpt.trim() || null,
          content: postData.content.trim(),
          is_published: postData.isPublished,
          author: postData.author.trim() || "Quản trị viên",
          cover_image_url: coverUrl,
          cover_image_storage_path: coverStoragePath
        }
      ])
      .select();

    if (error) throw error;

    if (data && data[0]) {
      return {
        ...data[0],
        isPublished: data[0].is_published,
        date: formatDate(data[0].created_at)
      };
    }
    
    return null;
  },

  /**
   * Tải ảnh chèn trong nội dung bài viết (Quill Editor) lên Storage
   */
  async uploadEditorImage(file) {
    const webpFile = await compressToWebP(file);
    const fileExt = "webp";
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const storagePath = `posts/editor_${uniqueFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(storagePath, webpFile, {
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("gallery")
      .getPublicUrl(storagePath);

    return publicUrl;
  },

  /**
   * Xóa bài viết khỏi Database và dọn dẹp ảnh bìa trên Storage
   */
  /**
   * Cập nhật một bài viết hiện tại kèm ảnh bìa
   */
  async updatePost(id, postData, coverFile, oldCoverStoragePath) {
    let coverUrl = postData.cover_image_url;
    let coverStoragePath = postData.cover_image_storage_path;

    // 1. Nếu người dùng tải lên ảnh bìa mới
    if (coverFile) {
      const webpCover = await compressToWebP(coverFile);
      const fileExt = "webp";
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const storagePath = `posts/${uniqueFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(storagePath, webpCover, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Dọn dẹp ảnh bìa cũ trên Storage
      if (oldCoverStoragePath) {
        await supabase.storage
          .from("gallery")
          .remove([oldCoverStoragePath]);
      }

      coverStoragePath = storagePath;
      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(storagePath);
      coverUrl = publicUrl;
    } else if (coverFile === null && !coverUrl && oldCoverStoragePath) {
      // Nếu Admin chủ động xóa ảnh bìa đại diện
      await supabase.storage
        .from("gallery")
        .remove([oldCoverStoragePath]);
      coverUrl = null;
      coverStoragePath = null;
    }

    // 2. Cập nhật thông tin trong Database
    const { data, error } = await supabase
      .from("posts")
      .update({
        title: postData.title.trim(),
        slug: postData.slug.trim(),
        category: postData.category,
        excerpt: postData.excerpt.trim() || null,
        content: postData.content.trim(),
        is_published: postData.isPublished,
        author: postData.author.trim() || "Quản trị viên",
        cover_image_url: coverUrl,
        cover_image_storage_path: coverStoragePath
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    if (data && data[0]) {
      return {
        ...data[0],
        isPublished: data[0].is_published,
        date: formatDate(data[0].created_at)
      };
    }
    
    return null;
  },

  /**
   * Xóa bài viết khỏi Database và dọn dẹp ảnh bìa trên Storage
   */
  async deletePost(id, coverImageStoragePath) {
    // 1. Xóa bản ghi trong Database
    const { error: dbError } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    // 2. Xóa ảnh bìa trong Storage nếu có
    if (coverImageStoragePath) {
      const { error: storageError } = await supabase.storage
        .from("gallery")
        .remove([coverImageStoragePath]);
        
      if (storageError) {
        console.warn("⚠️ Lỗi dọn dẹp ảnh bìa trong Storage:", storageError);
      }
    }

    return true;
  }
};

export default postService;
