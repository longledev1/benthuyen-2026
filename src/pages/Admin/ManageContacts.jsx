import React, { useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiInfo,
  FiX,
  FiPhone,
  FiMail,
  FiMessageSquare,
  FiCalendar,
  FiChevronDown,
} from "react-icons/fi";
import { FilterTabs, SearchInput, CustomSelect } from "../../components/Form";
import Pagination from "../../components/Pagination";
import { normalizePhone } from "../../utils/phoneHelper";
import { useDebounce } from "../../utils/useDebounce";
import { removeTones } from "../../utils/stringHelper";

// Helper để kiểm tra SĐT mới hay cũ và tính số lần liên hệ
const getPhoneStatus = (currentContact, allContacts) => {
  if (!currentContact || !allContacts || allContacts.length === 0) {
    return { isNew: true, count: 1 };
  }

  // Tìm tất cả liên hệ có cùng số điện thoại (đã chuẩn hóa)
  const cleanCurrentPhone = normalizePhone(currentContact.phone);
  const matches = allContacts.filter(
    (c) => normalizePhone(c.phone) === cleanCurrentPhone,
  );

  if (matches.length <= 1) {
    return { isNew: true, count: 1 };
  }

  // Sắp xếp các liên hệ trùng số điện thoại theo thời gian tạo tăng dần (cũ nhất lên đầu)
  const sortedMatches = [...matches].sort((a, b) => {
    const diff = new Date(a.created_at) - new Date(b.created_at);
    return diff !== 0 ? diff : a.id - b.id;
  });

  // Tìm vị trí của liên hệ hiện tại trong danh sách đã sắp xếp
  const index = sortedMatches.findIndex((c) => c.id === currentContact.id);

  // Nếu là liên hệ cũ nhất (index === 0), nghĩa là đây là lần đầu tiên họ gửi tin nhắn -> SĐT Mới
  if (index === 0 || index === -1) {
    return { isNew: true, count: 1 };
  } else {
    // Nếu index > 0, nghĩa là họ đã từng liên hệ trước đó -> SĐT Cũ / Khách quay lại
    return { isNew: false, count: index + 1 };
  }
};

export const ManageContacts = () => {
  const { contacts, handleToggleContactStatus, handleUpdateContactNote } =
    useOutletContext();

  const [searchContact, setSearchContact] = useState("");
  const debouncedSearchContact = useDebounce(searchContact, 300);
  const [contactStatusFilter, setContactStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [classificationFilter, setClassificationFilter] = useState("all");

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const contactsPerPage = 10;

  // Reset trang về 1 khi thay đổi tab lọc
  const handleFilterChange = (newTab) => {
    setContactStatusFilter(newTab);
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page: 1 });
  };

  // Reset trang về 1 khi gõ tìm kiếm
  const handleSearchChange = (e) => {
    setSearchContact(e.target.value);
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page: 1 });
  };

  // Reset trang về 1 khi xóa ô tìm kiếm
  const handleSearchClear = () => {
    setSearchContact("");
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page: 1 });
  };

  // Lọc cơ sở theo từ khóa tìm kiếm và phân loại cũ/mới (Chưa lọc theo Tab trạng thái xử lý)
  const baseFilteredContacts = contacts
    .filter((c) => {
      if (classificationFilter === "all") return true;
      const { isNew } = getPhoneStatus(c, contacts);
      if (classificationFilter === "new") return isNew;
      if (classificationFilter === "old") return !isNew;
      return true;
    })
    .filter((c) => {
      const query = debouncedSearchContact.trim();
      if (query === "") return true;

      // Chuẩn hóa tìm kiếm không dấu
      const cleanQuery = removeTones(query);

      // So khớp tên không dấu
      const cleanName = removeTones(c.name);
      if (cleanName.includes(cleanQuery)) return true;

      // So khớp số điện thoại
      const cleanPhone = normalizePhone(c.phone);
      const cleanQueryPhone = normalizePhone(cleanQuery);
      if (cleanQueryPhone && cleanPhone.includes(cleanQueryPhone)) return true;
      // Backup so khớp thô cho SĐT (nếu gõ số có dấu cách, dấu chấm...)
      if (c.phone.includes(query)) return true;

      // So khớp email
      if (c.email && removeTones(c.email).includes(cleanQuery)) return true;

      // So khớp phân loại: tính toán trạng thái
      const { isNew, count } = getPhoneStatus(c, contacts);

      if (isNew) {
        // "liên hệ lần đầu" hoặc "mới"
        const target1 = "lien he lan dau";
        const target2 = "moi";
        return target1.includes(cleanQuery) || target2.includes(cleanQuery);
      } else {
        // "liên hệ lần X" hoặc "quay lại" hoặc "lần X"
        const target1 = `lien he lan ${count}`;
        const target2 = "quay lai";
        const target3 = `lan ${count}`;
        return (
          target1.includes(cleanQuery) ||
          target2.includes(cleanQuery) ||
          target3.includes(cleanQuery)
        );
      }
    });

  // Lọc theo Tab trạng thái xử lý để ra danh sách cuối cùng hiển thị và phân trang
  const filteredContacts = baseFilteredContacts.filter(
    (c) => contactStatusFilter === "all" || c.status === contactStatusFilter,
  );

  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const startIndex = (currentPage - 1) * contactsPerPage;
  const paginatedContacts = filteredContacts.slice(
    startIndex,
    startIndex + contactsPerPage,
  );

  return (
    <div className="space-y-6">
      {/* Lọc và Tìm kiếm liên hệ */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
        <FilterTabs
          tabs={[
            {
              value: "all",
              label: "Tất cả liên hệ",
              count: baseFilteredContacts.length,
            },
            {
              value: "pending",
              label: "Chưa xử lý",
              count: baseFilteredContacts.filter((c) => c.status === "pending")
                .length,
            },
            {
              value: "completed",
              label: "Đã xử lý",
              count: baseFilteredContacts.filter(
                (c) => c.status === "completed",
              ).length,
            },
          ]}
          activeTab={contactStatusFilter}
          onTabChange={handleFilterChange}
        />

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {/* Dropdown Lọc Phân loại */}
          <CustomSelect
            value={classificationFilter}
            onChange={(val) => {
              setClassificationFilter(val);
              const params = Object.fromEntries(searchParams.entries());
              setSearchParams({ ...params, page: 1 });
            }}
            options={[
              { value: "all", label: "👥 Tất cả phân loại" },
              { value: "new", label: "🟢 Liên hệ lần đầu" },
              { value: "old", label: "🔵 Liên hệ cũ" },
            ]}
            className="w-full min-w-[195px] sm:w-auto"
            buttonClassName="w-full"
          />

          <SearchInput
            value={searchContact}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            placeholder="Tìm tên, SĐT khách..."
          />

          {/* Nút Reset bộ lọc (chỉ hiện khi có bộ lọc hoạt động) */}
          {(searchContact !== "" ||
            classificationFilter !== "all" ||
            contactStatusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchContact("");
                setClassificationFilter("all");
                setContactStatusFilter("all");
                setSearchParams({ page: 1 });
              }}
              className="flex cursor-pointer items-center justify-center space-x-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold whitespace-nowrap text-rose-600 shadow-sm transition-all hover:bg-rose-100/70"
            >
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* BẢNG DANH SÁCH LIÊN HỆ (Chỉ hiển thị trên màn hình lớn Desktop) */}
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
                        {(() => {
                          const { isNew, count } = getPhoneStatus(c, contacts);
                          return isNew ? (
                            <span className="inline-flex items-center rounded-full border border-emerald-200/50 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                              🟢 Liên hệ lần đầu
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full border border-blue-200/50 bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700">
                              🔵 Liên hệ lần {count}
                            </span>
                          );
                        })()}
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

      {/* DANH SÁCH DẠNG CARD (Hiển thị trên Mobile & Tablet/iPad) */}
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
                  {(() => {
                    const { isNew, count } = getPhoneStatus(c, contacts);
                    return isNew ? (
                      <span className="inline-flex items-center rounded-full border border-emerald-200/30 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                        🟢 Liên hệ lần đầu
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-blue-200/30 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                        🔵 Liên hệ lần {count}
                      </span>
                    );
                  })()}
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

      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          const params = Object.fromEntries(searchParams.entries());
          setSearchParams({ ...params, page });
        }}
      />

      {/* POPUP XEM CHI TIẾT BẢN LIÊN HỆ */}
      <AnimatePresence>
        {selectedContact && (
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
                    {(() => {
                      const { isNew, count } = getPhoneStatus(
                        selectedContact,
                        contacts,
                      );
                      return isNew ? (
                        <span className="inline-flex items-center rounded-full border border-emerald-200/50 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          🟢 Liên hệ lần đầu
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-blue-200/50 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                          🔵 Liên hệ lần {count}
                        </span>
                      );
                    })()}
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageContacts;
