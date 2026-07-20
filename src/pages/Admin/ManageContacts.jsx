import React, { useState, useMemo } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { FilterTabs, SearchInput, CustomSelect } from "../../components/Form";
import Pagination from "../../components/Pagination";
import { normalizePhone } from "../../utils/phoneHelper";
import { useDebounce } from "../../utils/useDebounce";
import { removeTones } from "../../utils/stringHelper";
import { getPhoneStatus } from "../../utils/contactHelper";

// Sub-components
import ContactTable from "./components/ManageContacts/ContactTable";
import ContactCards from "./components/ManageContacts/ContactCards";
import ContactDetailModal from "./components/ManageContacts/ContactDetailModal";

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
  const baseFilteredContacts = useMemo(() => {
    return contacts
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
  }, [contacts, classificationFilter, debouncedSearchContact]);

  // Lọc theo Tab trạng thái xử lý để ra danh sách cuối cùng hiển thị và phân trang
  const filteredContacts = useMemo(() => {
    return baseFilteredContacts.filter(
      (c) => contactStatusFilter === "all" || c.status === contactStatusFilter,
    );
  }, [baseFilteredContacts, contactStatusFilter]);

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
      <ContactTable
        paginatedContacts={paginatedContacts}
        contacts={contacts}
        setSelectedContact={setSelectedContact}
        handleToggleContactStatus={handleToggleContactStatus}
        handleUpdateContactNote={handleUpdateContactNote}
      />

      {/* DANH SÁCH DẠNG CARD (Hiển thị trên Mobile & Tablet/iPad) */}
      <ContactCards
        paginatedContacts={paginatedContacts}
        contacts={contacts}
        setSelectedContact={setSelectedContact}
        handleToggleContactStatus={handleToggleContactStatus}
        handleUpdateContactNote={handleUpdateContactNote}
      />

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
          <ContactDetailModal
            selectedContact={selectedContact}
            setSelectedContact={setSelectedContact}
            contacts={contacts}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageContacts;
