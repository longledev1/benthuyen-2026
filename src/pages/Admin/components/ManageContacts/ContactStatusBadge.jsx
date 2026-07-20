import React from "react";
import { getPhoneStatus } from "../../../../utils/contactHelper";

export const ContactStatusBadge = ({ contact, contacts, className = "" }) => {
  const { isNew, count } = getPhoneStatus(contact, contacts);

  return isNew ? (
    <span className={`inline-flex items-center rounded-full border border-emerald-200/50 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 whitespace-nowrap ${className}`}>
      🟢 Liên hệ lần đầu
    </span>
  ) : (
    <span className={`inline-flex items-center rounded-full border border-blue-200/50 bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 whitespace-nowrap ${className}`}>
      🔵 Liên hệ lần {count}
    </span>
  );
};

export default ContactStatusBadge;
