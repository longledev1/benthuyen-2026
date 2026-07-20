import React from "react";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import ContactStatusBadge from "./ContactStatusBadge";

export const ContactDetailModal = ({
  selectedContact,
  setSelectedContact,
  contacts,
}) => {
  if (!selectedContact) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedContact(null)}
        className="bg-primary/60 fixed inset-0 cursor-pointer backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-[101] max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-black/5 bg-white text-slate-800 shadow-2xl"
      >
        <div className="via-secondary h-[4px] w-full bg-gradient-to-r from-transparent to-transparent" />

        <div className="p-5 sm:p-8">
          <button
            onClick={() => setSelectedContact(null)}
            className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 sm:top-6 sm:right-6"
          >
            <FiX size={18} />
          </button>

          <span className="text-secondary mb-1 block text-[10px] font-semibold tracking-[0.25em] uppercase">
            Chi Tiết Ý Kiến Khách Hàng
          </span>
          <h3 className="text-primary mb-6 font-sans text-xl font-bold sm:text-2xl">
            Thông tin phản hồi
          </h3>

          <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-5 text-sm sm:grid-cols-2">
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">
                Khách hàng
              </span>
              <span className="block text-base font-bold text-slate-800">
                {selectedContact.name}
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">
                Thời gian gửi
              </span>
              <span className="block font-sans text-sm font-medium text-slate-600">
                {selectedContact.date}
              </span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">
                Số điện thoại
              </span>
              <a
                href={`tel:${selectedContact.phone}`}
                className="text-primary block font-sans text-sm font-bold hover:underline"
              >
                {selectedContact.phone}
              </a>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">
                Thư điện tử
              </span>
              {selectedContact.email ? (
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="block truncate font-sans text-sm font-semibold text-slate-600 hover:underline"
                  title={selectedContact.email}
                >
                  {selectedContact.email}
                </a>
              ) : (
                <span className="block font-sans text-sm text-slate-400 italic">
                  Không cung cấp
                </span>
              )}
            </div>
            <div className="mt-1 space-y-1 border-t border-slate-200/60 pt-3 sm:col-span-2">
              <span className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
                Phân loại liên hệ
              </span>
              <ContactStatusBadge contact={selectedContact} contacts={contacts} />
            </div>
          </div>

          <div className="mb-6">
            <span className="mb-2 block text-[10px] font-bold text-slate-400 uppercase">
              Lời nhắn phản hồi
            </span>
            <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-4 text-justify text-sm leading-relaxed font-normal whitespace-pre-line text-slate-700 sm:p-5">
              {selectedContact.message}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-6">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Trạng thái:
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  selectedContact.status === "completed"
                    ? "border border-emerald-100 bg-emerald-50 text-emerald-600"
                    : "border border-amber-100 bg-amber-50 text-amber-600"
                }`}
              >
                {selectedContact.status === "completed"
                  ? "Đã xử lý"
                  : "Chưa xử lý"}
              </span>
            </div>
            <button
              onClick={() => setSelectedContact(null)}
              className="bg-primary hover:bg-primary/90 cursor-pointer rounded-lg px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactDetailModal;
