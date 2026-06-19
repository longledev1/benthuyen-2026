import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiClock,
  FiPhoneCall,
  FiUser,
  FiPhone,
  FiMail,
  FiMessageSquare,
  FiCheckCircle,
  FiAlertCircle,
  FiSend,
  FiMap,
} from "react-icons/fi";
import { contactService } from "../../services/contactService";
import { contactSchema } from "../../validation/contactValidation";

export const ContactSection = () => {
  const [activeTab, setActiveTab] = useState("map"); // "map" | "message"
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

    // Validation using Zod
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

  return (
    <section className="relative overflow-hidden border-t border-slate-100 bg-[#faf9f6] py-24">
      {/* SOFT GLOWING BACKGROUND SHAPES */}
      <div className="bg-primary/5 pointer-events-none absolute top-0 left-0 h-[500px] w-[500px] rounded-full blur-[120px]" />
      <div className="bg-secondary/5 pointer-events-none absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full blur-[100px]" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          {/* LEFT COLUMN: BRAND INFO & INFO DECK */}
          <div className="flex flex-col space-y-10 text-left lg:col-span-5">
            <div>
              <h2 className="text-secondary text-4xl leading-tight font-bold italic md:text-5xl">
                Chúng tôi luôn <br />
                <span className="text-primary font-bold italic">
                  đón chờ quý khách
                </span>
              </h2>
            </div>

            {/* INFO CARDS DECK */}
            <div className="space-y-6">
              {/* CARD 1: ADDRESS */}
              <a
                href="https://maps.app.goo.gl/baJzsKqt9GsbXwxL6"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start space-x-5 rounded-2xl border border-slate-100/80 bg-white p-5 transition-all duration-350 hover:border-slate-200 hover:shadow-[0_15px_30px_rgba(0,0,0,0.04)]"
              >
                <div className="bg-primary/5 text-primary group-hover:bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-350 group-hover:scale-110">
                  <FiMapPin size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-primary text-[11px] font-extrabold tracking-[0.2em] uppercase">
                    Địa chỉ nhà hàng
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-700 transition-colors group-hover:text-slate-900">
                    45 Trần Quốc Thảo, Phường Võ Thị Sáu, Quận 3, TP.HCM
                  </p>
                  <span className="text-secondary/70 group-hover:text-secondary inline-block pt-1 text-[11px] underline transition-colors">
                    Xem trên Google Maps →
                  </span>
                </div>
              </a>

              {/* CARD 2: TIME */}
              <div className="flex items-start space-x-5 rounded-2xl border border-slate-100/80 bg-white p-5 transition-all duration-350 hover:border-slate-200">
                <div className="bg-primary/5 text-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-350">
                  <FiClock size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-primary text-[11px] font-extrabold tracking-[0.2em] uppercase">
                    Thời gian hoạt động
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-700">
                    Thứ 2 - Chủ Nhật: 10:00 AM - 23:00 PM
                  </p>
                  <p className="text-xs text-slate-500">
                    Phục vụ cả ngày lễ và ngày cuối tuần
                  </p>
                </div>
              </div>

              {/* CARD 3: HOTLINE */}
              <a
                href="tel:0778727894"
                className="group flex items-start space-x-5 rounded-2xl border border-slate-100/80 bg-white p-5 transition-all duration-350 hover:border-slate-200 hover:shadow-[0_15px_30px_rgba(0,0,0,0.04)]"
              >
                <div className="bg-opacity-10 group-hover:bg-opacity-20 relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-all duration-350 group-hover:scale-110">
                  <FiPhoneCall size={20} />
                  {/* Glowing Pulse Dot */}
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500"></span>
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold tracking-[0.2em] text-emerald-600 uppercase">
                    Hotline Liên hệ
                  </h4>
                  <p className="text-lg font-semibold text-emerald-600 transition-colors group-hover:text-emerald-500">
                    0778.727.894
                  </p>
                  <p className="text-xs text-slate-500">
                    Hỗ trợ tư vấn đặt tiệc & sự kiện 24/7
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: GLASS PANELS WITH TABS */}
          <div className="w-full lg:col-span-7">
            <div className="relative flex min-h-[550px] flex-col overflow-hidden rounded-3xl border border-slate-100/80 bg-white p-6 shadow-xl md:p-8">
              {/* TAB SELECTOR HEADER */}
              <div className="relative z-10 mb-8 flex justify-start space-x-4 border-b border-slate-200 pb-6">
                <button
                  onClick={() => {
                    setActiveTab("map");
                    setError("");
                  }}
                  className={`relative flex items-center space-x-2 pb-2 text-xs font-bold tracking-[0.2em] uppercase transition-all ${
                    activeTab === "map"
                      ? "text-primary"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <FiMap size={14} />
                  <span className="cursor-pointer">Vị trí bản đồ</span>
                  {activeTab === "map" && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="bg-primary absolute right-0 bottom-0 left-0 h-[2px]"
                    />
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveTab("message");
                  }}
                  className={`relative flex items-center space-x-2 pb-2 text-xs font-bold tracking-[0.2em] uppercase transition-all ${
                    activeTab === "message"
                      ? "text-primary"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <FiSend size={14} />
                  <span className="cursor-pointer">Gửi lời nhắn nhanh</span>
                  {activeTab === "message" && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="bg-primary absolute right-0 bottom-0 left-0 h-[2px]"
                    />
                  )}
                </button>
              </div>

              {/* TAB CONTENT WITH FRAMEWORK ANIMATIONS */}
              <div className="relative z-10 flex flex-grow flex-col justify-center">
                <AnimatePresence mode="wait">
                  {activeTab === "map" ? (
                    <motion.div
                      key="map-tab"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="group/map relative h-[380px] w-full overflow-hidden rounded-2xl border border-slate-100 shadow-md md:h-[420px]"
                    >
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4113860504285!2d106.68734537451728!3d10.779770559133077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f306c1fb84f%3A0x4fbe0a94c83e88bd!2zNDUgVHLhuqduIFF14buRYyBUaOG6o28sIFBoxrDhu51uZyA2LCBYdcOibiBIw7JhLCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1776966338240!5m2!1svi!2s"
                        className="absolute inset-0 h-full w-full border-0 opacity-95 transition-all duration-350"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="NS Bến Thuyền Location Map"
                      ></iframe>
                      {/* Frame with hint */}
                      <div className="pointer-events-none absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/90 px-4 py-2.5 text-left shadow-md">
                        <span className="text-[10px] tracking-widest text-white/60 uppercase">
                          BẢN ĐỒ TƯƠNG TÁC
                        </span>
                        <span className="text-secondary text-[10px] font-semibold tracking-widest uppercase">
                          QUẬN 3 • TP.HCM
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form-tab"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      {success ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-10 text-center">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600"
                          >
                            <FiCheckCircle size={32} />
                          </motion.div>
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-slate-800">
                              Gửi thành công!
                            </h3>
                            <p className="max-w-sm text-sm leading-relaxed text-slate-500">
                              Cảm ơn bạn đã liên hệ. Đội ngũ NS Bến Thuyền đã
                              ghi nhận và sẽ phản hồi quý khách sớm nhất qua số
                              điện thoại hoặc email.
                            </p>
                          </div>
                          <button
                            onClick={() => setSuccess(false)}
                            className="border-primary text-primary hover:bg-primary mt-4 rounded-lg border px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-350 hover:text-white"
                          >
                            Gửi lời nhắn mới
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                          {/* Alert Error */}
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-600"
                            >
                              <FiAlertCircle
                                className="flex-shrink-0"
                                size={16}
                              />
                              <span>{error}</span>
                            </motion.div>
                          )}

                          {/* Inputs: Name */}
                          <div className="space-y-1.5 text-left">
                            <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                              Họ tên của bạn{" "}
                              <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <FiUser size={16} />
                              </span>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nguyễn Văn A"
                                className="focus:border-primary focus:ring-primary w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pr-4 pl-12 text-sm text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-1 focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Inputs: Row Phone & Email */}
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Phone */}
                            <div className="space-y-1.5 text-left">
                              <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Số điện thoại{" "}
                                <span className="text-rose-500">*</span>
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                  <FiPhone size={16} />
                                </span>
                                <input
                                  type="tel"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  placeholder="0901234567"
                                  className="focus:border-primary focus:ring-primary w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pr-4 pl-12 text-sm text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-1 focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5 text-left">
                              <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Địa chỉ Email{" "}
                                <span className="font-normal text-slate-400">
                                  (tùy chọn)
                                </span>
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                  <FiMail size={16} />
                                </span>
                                <input
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  placeholder="email@example.com"
                                  className="focus:border-primary focus:ring-primary w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pr-4 pl-12 text-sm text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-1 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Input: Message */}
                          <div className="space-y-1.5 text-left">
                            <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                              Lời nhắn cho chúng tôi{" "}
                              <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute top-3.5 left-4 text-slate-400">
                                <FiMessageSquare size={16} />
                              </span>
                              <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Nhập lời nhắn, đóng góp ý kiến hoặc yêu cầu đặc biệt của quý khách..."
                                className="focus:border-primary focus:ring-primary w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 py-3 pr-4 pl-12 text-sm leading-relaxed text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-1 focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Submit Button */}
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:shadow-primary/10 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-xl py-4 text-xs font-bold tracking-[0.25em] text-white uppercase shadow-md transition-all disabled:pointer-events-none disabled:opacity-50"
                          >
                            {loading ? (
                              <>
                                <svg
                                  className="mr-3 h-4 w-4 animate-spin text-white"
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
                              <>
                                <FiSend size={14} className="mt-[-2px]" />
                                <span>Gửi tin nhắn liên hệ</span>
                              </>
                            )}
                          </motion.button>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
