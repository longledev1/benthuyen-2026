import React from "react";
import { FiInfo, FiMessageSquare } from "react-icons/fi";
import { CustomSelect } from "../../../../components/Form";
import ContactStatusBadge from "./ContactStatusBadge";

export const ContactTable = ({
  paginatedContacts,
  contacts,
  setSelectedContact,
  handleToggleContactStatus,
  handleUpdateContactNote,
}) => {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm xl:block">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 font-sans text-[10px] tracking-widest text-slate-500 uppercase">
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Thông tin liên hệ</th>
              <th className="min-w-[250px] px-6 py-4">Lời nhắn / Phản hồi</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="min-w-[200px] px-6 py-4">Ghi chú nội bộ</th>
              <th className="px-6 py-4 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
            {paginatedContacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FiMessageSquare className="text-slate-300" size={40} />
                    <p className="text-sm font-semibold text-slate-400">
                      Không tìm thấy ý kiến liên hệ nào.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedContacts.map((c, index) => (
                <tr
                  key={c.id}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-slate-800">
                      {c.name}
                    </p>
                    <span className="font-sans text-xs text-slate-400">
                      {c.date}
                    </span>
                  </td>
                  <td className="space-y-1.5 px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm font-semibold text-slate-800">
                        {c.phone}
                      </span>
                      <ContactStatusBadge contact={c} contacts={contacts} />
                    </div>
                    {c.email && (
                      <p className="font-sans text-xs text-slate-400">
                        {c.email}
                      </p>
                    )}
                  </td>
                  <td className="max-w-xs min-w-[250px] px-6 py-4">
                    <p
                      onClick={() => setSelectedContact(c)}
                      className="hover:text-primary line-clamp-2 cursor-pointer text-justify text-sm leading-relaxed font-medium text-slate-600 hover:underline"
                    >
                      {c.message}
                    </p>
                  </td>
                  <td className="px-6 py-4">
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
                          ? "border border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/75"
                          : "border border-amber-250 bg-amber-50 text-amber-700 hover:bg-amber-100/75"
                      }`}
                      className="w-[135px]"
                      placement={
                        index >= paginatedContacts.length - 2
                          ? "top"
                          : "bottom"
                      }
                    />
                  </td>
                  <td className="min-w-[200px] px-6 py-4">
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactTable;
