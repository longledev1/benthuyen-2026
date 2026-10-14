import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBanner from "../components/HeroBanner";
import { RestaurantNoticeModal } from "../components/RestaurantNoticeModal.jsx";
import { ContactModal } from "../components/ContactModal.jsx";
import { BookingModal } from "../components/BookingModal.jsx";
import { FloatingContact } from "../components/FloatingContact";

export const MainLayout = () => {
  const { pathname } = useLocation();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Khóa cuộn trang nền khi có modal đang mở
  useEffect(() => {
    if (isContactOpen || isBookingOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isContactOpen, isBookingOpen]);

  const shouldHideFooter = pathname.startsWith("/gallery") || pathname.startsWith("/menu");

  return (
    <div>
      {/* Notice Modal */}
      <RestaurantNoticeModal />

      {/* Header */}
      <Header
        onOpenContact={() => setIsContactOpen(true)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />
      {/* Hero Banner */}
      {/* Main Content */}
      <Outlet />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Floating Contact Widget */}
      <FloatingContact />

      {/* Footer */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
};
