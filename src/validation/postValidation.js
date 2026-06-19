import { z } from "zod";

export const postSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: "Tiêu đề bài viết không được để trống." })
    .min(10, { message: "Tiêu đề bài viết phải có ít nhất 10 ký tự." }),
  slug: z.string()
    .trim()
    .min(1, { message: "Đường dẫn slug không được để trống." })
    .regex(/^[a-z0-9-_]+$/, { message: "Slug chỉ chứa chữ thường không dấu, số, và dấu gạch nối (-)." }),
  category: z.enum(["su-kien", "am-thuc", "dich-vu"], {
    errorMap: () => ({ message: "Vui lòng chọn danh mục bài viết hợp lệ." }),
  }),
  excerpt: z.string()
    .trim()
    .min(1, { message: "Tóm tắt bài viết không được để trống." })
    .min(10, { message: "Tóm tắt bài viết phải có ít nhất 10 ký tự." }),
  content: z.string()
    .trim()
    .min(1, { message: "Nội dung bài viết không được để trống." })
    .refine((val) => val.replace(/<[^>]*>/g, "").trim().length >= 10, {
      message: "Nội dung bài viết phải chứa ít nhất 10 ký tự văn bản.",
    }),
  author: z.string()
    .trim()
    .min(1, { message: "Tên tác giả không được để trống." }),
});

export default postSchema;
