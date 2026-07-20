import React from "react";
import {
  FiInfo,
  FiMessageSquare,
  FiCalendar,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { CustomSelect } from "../../../../components/Form";
import ContactStatusBadge from "./ContactStatusBadge";

export const ContactCards = ({
  paginatedContacts,
  contacts,
  setSelectedContact,
  handleToggleContactStatus,
  handleUpdateContactNote,
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:hidden">
      {paginatedContacts.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-black/5 bg-white py-16 text-center shadow-sm">
          <FiMessageSquare className="text-slate-350 mb-3" size={40} />
          <p className="text-sm font-medium text-slate-400">
            Không tìm thấy ý kiến liên hệ nào.
          </p>
        </div>
      ) : (
        paginatedContacts.map((c) => (
          <div
            key={c.id}
            className={`flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
              c.status === "completed"
                ? "border-slate-100"
                : "border-amber-100"
            }`}
          >
            {/* Card Header: Avatar, Tên khách hàng & Trạng thái */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="bg-primary/5 text-primary flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-base font-bold">
                  {c.name ? c.name.trim().charAt(0).toUpperCase() : "?"}
                </div>
                <div>
                  <h4 className="text-base leading-snug font-bold text-slate-800">
                    {c.name}
                  </h4>
                  <div className="mt-0.5 flex items-center space-x-1 text-xs text-slate-400">
                    <FiCalendar size={12} className="text-slate-400" />
                    <span className="font-sans">{c.date}</span>
                  </div>
                </div>
              </div>

              {/* Dropdown Trạng thái */}
              <CustomSelect
                value={c.status}
                onChange={(val) => handleToggleContactStatus(c.id, val)}
                options={[
                  { value: "pending", label: "🟡 Chưa xử lý" },
                  { value: "completed", label: "🟢 Đã xử lý" },
                ]}
                customButton={true}
                buttonClassName={`w-full rounded-full pl-3 pr-8 py-1.5 text-xs font-bold cursor-pointer transition-all ${
                  c.status === "completed"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70"
                    : "border border-amber-250 bg-amber-50 text-amber-700 hover:bg-amber-100/70"
                }`}
                className="w-[135px]"
              />
            </div>

            {/* Card Body: Thông tin liên hệ & Lời nhắn */}
            <div className="flex-1 space-y-3.5 py-4 text-slate-600">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Số điện thoại (Click để gọi) */}
                <div className="flex flex-col rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                  <span className="mb-1 text-[9px] font-bold text-slate-400 uppercase">
                    Điện thoại:
                  </span>
                  <a
                    href={`tel:${c.phone}`}
                    className="flex items-center space-x-1.5 font-sans text-sm font-bold text-[#3c6881] hover:underline"
                  >
                    <FiPhone size={12} className="text-secondary" />
                    <span className="truncate">{c.phone}</span>
                  </a>
                </div>
                {/* Email (Click để gửi mail) */}
                <div className="flex flex-col rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                  <span className="mb-1 text-[9px] font-bold text-slate-400 uppercase">
                    Thư điện tử:
                  </span>
                  {c.email ? (
                    <a
                      href={`mailto:${c.email}`}
                      className="flex items-center space-x-1.5 font-sans text-sm text-slate-600 hover:underline"
                      title={c.email}
                    >
                      <FiMail size={12} className="text-secondary" />
                      <span className="truncate">{c.email}</span>
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400 italic">
                      Trống
                    </span>
                  )}
                </div>
              </div>

              {/* Phân loại liên hệ */}
              <div className="flex items-center space-x-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase">
                  Phân loại:
                </span>
                <ContactStatusBadge
                  contact={c}
                  contacts={contacts}
                  className="!px-2.5 !text-[10px]"
                />
              </div>

              {/* Lời nhắn */}
              <div className="space-y-1">
                <span className="block text-[9px] font-bold text-slate-400 uppercase">
                  Lời nhắn phản hồi:
                </span>
                <div
                  onClick={() => setSelectedContact(c)}
                  className="group/msg relative cursor-pointer rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-justify leading-relaxed transition-colors hover:bg-slate-100/50"
                >
                  <p className="line-clamp-3 pr-6 text-xs text-slate-700">
                    {c.message}
                  </p>
                  <span className="group-hover/msg:text-primary absolute right-3 bottom-3 text-slate-400 transition-colors">
                    <FiMessageSquare size={12} />
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer: Ghi chú nội bộ */}
            <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
              <div className="flex-1 space-y-1">
                <span className="block text-[9px] font-bold text-slate-400 uppercase">
                  Ghi chú nội bộ:
                </span>
                <input
                  type="text"
                  defaultValue={c.note || ""}
                  onBlur={(e) => {
                    if (e.target.value !== (c.note || "")) {
                      handleUpdateContactNote(c.id, e.target.value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.target.blur();
                    }
                  }}
                  placeholder="Nhập ghi chú nhanh..."
                  className="focus:border-primary w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs placeholder-slate-400 transition-colors focus:bg-white focus:outline-none"
                />
              </div>
              <button
                onClick={() => setSelectedContact(c)}
                className="hover:bg-primary flex h-8 w-8 cursor-pointer items-center justify-center self-end rounded-lg bg-slate-50 text-slate-500 transition-all hover:text-white"
                title="Xem chi tiết"
              >
                <FiInfo size={14} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ContactCards;
