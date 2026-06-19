import { z } from "zod";

export const galleryUploadSchema = z.object({
  category: z.enum(["history", "food", "event"], {
    errorMap: () => ({ message: "Vui lòng chọn danh mục hình ảnh hợp lệ." }),
  }),
  title: z.string().trim().optional(),
  filesCount: z
    .number()
    .min(1, { message: "Vui lòng chọn ít nhất một hình ảnh để đăng tải." }),
});

export default galleryUploadSchema;
