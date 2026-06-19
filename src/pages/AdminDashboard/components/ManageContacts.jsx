import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiInfo, FiX } from "react-icons/fi";
import { FilterTabs, SearchInput } from "../../../components/Form";

export const ManageContacts = ({
  contacts = [],
  contactStatusFilter,
  setContactStatusFilter,
  searchContact,
  setSearchContact,
  handleToggleContactStatus,
  handleUpdateContactNote,
}) => {
  // State popup xem chi tiết liên hệ
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <div className="space-y-6">
      {/* Lọc và Tìm kiếm liên hệ */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
        <FilterTabs
          tabs={[
            { value: "all", label: "Tất cả liên hệ", count: contacts.length },
            {
              value: "pending",
              label: "Chưa xử lý",
              count: contacts.filter((c) => c.status === "pending").length,
            },
            {
              value: "completed",
              label: "Đã xử lý",
              count: contacts.filter((c) => c.status === "completed").length,
            },
          ]}
          activeTab={contactStatusFilter}
          onTabChange={setContactStatusFilter}
        />

        <SearchInput
          value={searchContact}
          onChange={(e) => setSearchContact(e.target.value)}
          onClear={() => setSearchContact("")}
          placeholder="Tìm tên, SĐT khách..."
        />
      </div>

      {/* Bảng danh sách liên hệ */}
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 font-sans text-[10px] tracking-widest text-slate-500 uppercase">
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Thông tin liên hệ</th>
                <th className="px-6 py-4">Lời nhắn / Phản hồi</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Ghi chú nội bộ</th>
                <th className="px-6 py-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {contacts
                .filter(
                  (c) =>
                    contactStatusFilter === "all" ||
                    c.status === contactStatusFilter,
                )
                .filter((c) => {
                  if (searchContact.trim() === "") return true;
                  const query = searchContact.toLowerCase();
                  return (
                    c.name.toLowerCase().includes(query) ||
                    c.phone.includes(query)
                  );
                })
                .map((c) => (
                  <tr
                    key={c.id}
                    className="transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{c.name}</p>
                      <span className="font-sans text-[10px] text-slate-400">
                        {c.date}
                      </span>
                    </td>
                    <td className="space-y-1 px-6 py-4">
                      <p className="font-sans text-xs text-slate-800">
                        {c.phone}
                      </p>
                      {c.email && (
                        <p className="font-sans text-xs text-slate-400">
                          {c.email}
                        </p>
                      )}
                    </td>
                    <td className="max-w-xs px-6 py-4">
                      <p
                        onClick={() => setSelectedContact(c)}
                        className="hover:text-primary line-clamp-2 cursor-pointer text-justify text-xs leading-relaxed font-normal text-slate-600 hover:underline"
                      >
                        {c.message}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={c.status}
                        onChange={(e) =>
                          handleToggleContactStatus(c.id, e.target.value)
                        }
                        className={`cursor-pointer appearance-none rounded-lg border px-2.5 py-1.5 text-xs font-bold focus:outline-none ${
                          c.status === "completed"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                            : "border-amber-200 bg-amber-50 text-amber-600"
                        }`}
                      >
                        <option value="pending">🟡 Chưa xử lý</option>
                        <option value="completed">🟢 Đã xử lý</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={c.note}
                        onChange={(e) =>
                          handleUpdateContactNote(c.id, e.target.value)
                        }
                        placeholder="Nhập ghi chú nhanh..."
                        className="focus:border-primary w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs placeholder-slate-400 focus:bg-white focus:outline-none"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedContact(c)}
                        className="hover:bg-primary ml-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-all hover:text-white"
                        title="Xem chi tiết"
                      >
                        <FiInfo size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP XEM CHI TIẾT BẢN LIÊN HỆ */}
      <AnimatePresence>
        {selectedContact && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContact(null)}
              className="bg-primary/60 fixed inset-0 cursor-pointer backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="animate-in relative z-[101] w-full max-w-xl overflow-hidden rounded-2xl border border-black/5 bg-white text-slate-800 shadow-2xl"
            >
              {/* Gold decorative top hairline */}
              <div className="via-secondary h-[4px] w-full bg-gradient-to-r from-transparent to-transparent" />

              <div className="p-8">
                {/* Nút đóng */}
                <button
                  onClick={() => setSelectedContact(null)}
                  className="absolute top-6 right-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
                >
                  <FiX size={18} />
                </button>

                <span className="text-secondary mb-1 block text-[10px] font-semibold tracking-[0.25em] uppercase">
                  Chi Tiết Ý Kiến Khách Hàng
                </span>
                <h3 className="text-primary mb-6 font-serif text-2xl font-normal">
                  Thông tin phản hồi
                </h3>

                {/* Chi tiết liên hệ */}
                <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-sm">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                      Khách hàng
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedContact.name}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                      Thời gian gửi
                    </span>
                    <span className="font-sans text-xs font-medium text-slate-600">
                      {selectedContact.date}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                      Số điện thoại
                    </span>
                    <span className="text-primary font-sans text-xs font-bold">
                      {selectedContact.phone}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                      Thư điện tử
                    </span>
                    <span className="font-sans text-xs font-semibold text-slate-600">
                      {selectedContact.email || "Không cung cấp"}
                    </span>
                  </div>
                </div>

                {/* Nội dung tin nhắn */}
                <div className="mb-6">
                  <span className="mb-2 block text-[10px] font-bold text-slate-400 uppercase">
                    Lời nhắn phản hồi
                  </span>
                  <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-5 text-justify text-sm leading-relaxed font-normal text-slate-700">
                    {selectedContact.message}
                  </div>
                </div>

                {/* Hành động nhanh */}
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
                    className="bg-primary cursor-pointer rounded-lg px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-[#1f284e]"
                  >
                    Đồng ý
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageContacts;
