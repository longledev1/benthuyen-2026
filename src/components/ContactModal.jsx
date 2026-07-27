import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUser, FiPhone, FiMail, FiMessageSquare } from "react-icons/fi";
import { contactService } from "../services/contactService";
import { contactSchema } from "../validation/contactValidation";

export const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Sử dụng Zod để kiểm tra tính hợp lệ của dữ liệu
    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      await contactService.createContact(formData);

      setSuccess(true);
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      console.error("⚠️ Lỗi gửi thông tin liên hệ:", err);
      setError("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="bg-primary/60 fixed inset-0 cursor-pointer backdrop-blur-md"
          />

          {/* Form Modal Content (Nền trắng, chữ tối tương phản cao cho khách trung niên dễ đọc) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative z-[101] w-full max-w-2xl max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-hidden rounded-2xl border border-black/5 bg-white text-slate-800 shadow-2xl thin-scrollbar"
          >
            {/* Top decorative gold line */}
            <div className="via-secondary h-[4px] w-full bg-gradient-to-r from-transparent to-transparent" />

            {/* Header Area */}
            <div className="p-6 md:p-8 pb-3 md:pb-4 text-center">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
                aria-label="Đóng"
              >
                <FiX size={18} />
              </button>

              <span className="text-secondary text-[10px] md:text-[11px] font-semibold tracking-[0.25em] uppercase">
                Liên Hệ & Phản Hồi
              </span>
              <h3 className="text-primary mt-1 mb-2 text-xl md:text-2xl font-bold tracking-wide">
                Kết nối với NS Bến Thuyền
              </h3>
              <p className="font-normal mx-auto max-w-xs md:max-w-sm font-sans text-xs leading-relaxed text-slate-500">
                Quý khách có thể gửi ý kiến đóng góp, phản hồi hoặc câu hỏi.
                Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
              </p>
            </div>

            {/* Form & Success States */}
            <div className="px-6 pb-6 md:px-8 md:pb-8">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h4 className="text-primary mb-2 text-xl font-semibold">
                    Gửi thành công!
                  </h4>
                  <p className="font-normalt max-w-xs text-sm leading-relaxed text-slate-500">
                    Cảm ơn quý khách đã gửi ý kiến phản hồi. NS Bến Thuyền đã
                    ghi nhận và sẽ liên hệ lại sớm nhất.
                  </p>
                  <button
                    onClick={handleClose}
                    className="bg-primary hover:bg-primary/90 mt-6 cursor-pointer rounded-md px-8 py-3 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-md transition-all duration-300"
                  >
                    Đóng cửa sổ
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-600"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Input Name */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="text-primary mb-1 block md:mb-1.5 text-[10px] md:text-xs font-semibold tracking-wider uppercase"
                    >
                      Họ và tên Anh/Chị <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <FiUser size={15} />
                      </span>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        className="focus:border-primary focus:ring-primary w-full rounded-lg border border-slate-300 bg-slate-50 py-2 md:py-2.5 pr-4 pl-10 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-1 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Input Row: Phone & Email */}
                  <div className="grid grid-cols-1 gap-3 md:gap-4 sm:grid-cols-2">
                    {/* Input Phone */}
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="text-primary mb-1 block md:mb-1.5 text-[10px] md:text-xs font-semibold tracking-wider uppercase"
                      >
                        Số điện thoại <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <FiPhone size={15} />
                        </span>
                        <input
                          id="contact-phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0901234567"
                          className="focus:border-primary focus:ring-primary w-full rounded-lg border border-slate-300 bg-slate-50 py-2 md:py-2.5 pr-4 pl-10 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-1 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Input Email */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="text-primary mb-1 block md:mb-1.5 text-[10px] md:text-xs font-semibold tracking-wider uppercase"
                      >
                        Email <span className="text-slate-400">(nếu có)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <FiMail size={15} />
                        </span>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="email@example.com"
                          className="focus:border-primary focus:ring-primary w-full rounded-lg border border-slate-300 bg-slate-50 py-2 md:py-2.5 pr-4 pl-10 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-1 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Textarea Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="text-primary mb-1 block md:mb-1.5 text-[10px] md:text-xs font-semibold tracking-wider uppercase"
                    >
                      Nội dung liên hệ hoặc phản ánh{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute top-3 left-3 text-slate-400">
                        <FiMessageSquare size={15} />
                      </span>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Hãy để lại ý kiến phản hồi hoặc nội dung cần phản ánh của quý khách tại đây..."
                        className="focus:border-primary focus:ring-primary w-full resize-none rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm leading-relaxed font-medium text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-1 focus:outline-none h-20 md:h-28"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-lg py-3 md:py-3.5 text-xs font-bold tracking-[0.25em] text-white uppercase shadow-lg transition-all active:scale-98 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="mr-3 -ml-1 h-4 w-4 animate-spin text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Đang gửi thông tin...</span>
                      </>
                    ) : (
                      <span>Gửi yêu cầu liên hệ</span>
                    )}
                  </button>
                </form>
              )}

              {/* Hoặc liên hệ trực tiếp */}
              <div className="mt-6 border-t border-slate-100 pt-4 text-center">
                <p className="text-primary mb-3 text-[10px] font-bold tracking-[0.2em] uppercase">
                  Hoặc kết nối trực tiếp với chúng tôi
                </p>
                <div className="flex flex-wrap justify-center gap-2.5 md:gap-4">
                  {/* Zalo */}
                  <a
                    href="https://zalo.me/0909886058"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-slate-150 flex cursor-pointer items-center gap-2 md:gap-3 rounded-lg bg-slate-50 px-3 py-2 md:px-7 md:py-3 shadow-sm transition-all hover:bg-slate-100/80 hover:shadow active:scale-95"
                  >
                    <img
                      src="/icon/Zalo.webp"
                      alt="Zalo"
                      className="h-4 w-4 md:h-6 md:w-6 object-contain"
                    />
                    <span className="text-[11px] md:text-sm font-bold text-slate-600">
                      Zalo
                    </span>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-slate-150 flex cursor-pointer items-center gap-2 md:gap-3 rounded-lg bg-slate-50 px-3 py-2 md:px-7 md:py-3 shadow-sm transition-all hover:bg-slate-100/80 hover:shadow active:scale-95"
                  >
                    <img
                      src="/icon/Facebook.webp"
                      alt="Facebook"
                      className="h-4 w-4 md:h-6 md:w-6 object-contain"
                    />
                    <span className="text-[11px] md:text-sm font-bold text-slate-600">
                      Facebook
                    </span>
                  </a>

                  {/* Phone */}
                  <a
                    href="tel:0909886058"
                    className="border-slate-150 flex cursor-pointer items-center gap-2 md:gap-3 rounded-lg bg-slate-50 px-3 py-2 md:px-7 md:py-3 shadow-sm transition-all hover:bg-slate-100/80 hover:shadow active:scale-95"
                  >
                    <FiPhone className="h-4 w-4 md:h-5 md:w-5 text-[#3c6881]" />
                    <span className="text-[11px] md:text-sm font-bold text-slate-600">
                      Gọi Hotline
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
