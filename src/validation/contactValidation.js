import { z } from "zod";

export const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Họ và tên không được để trống." })
    .min(2, { message: "Họ và tên phải có ít nhất 2 ký tự." }),
  phone: z.string()
    .trim()
    .min(1, { message: "Số điện thoại không được để trống." })
    .regex(/^(0[35789])[0-9]{8}$/, { message: "Số điện thoại không hợp lệ (phải bắt đầu từ 03, 05, 07, 08, 09 và gồm 10 chữ số)." }),
  email: z.string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Địa chỉ email không hợp lệ.",
    }),
  message: z.string()
    .trim()
    .min(1, { message: "Nội dung liên hệ không được để trống." })
    .min(10, { message: "Nội dung liên hệ phải có ít nhất 10 ký tự." }),
});

export default contactSchema;
