import React, { lazy, Suspense } from "react";
import AboutStory from "../../components/HomePage/AboutStory";
import FoodSlide from "../../components/HomePage/FoodSlide";
import MenuSection from "../../components/HomePage/MenuSection";
import HeroBanner from "../../components/HeroBanner";
import SEO from "../../components/SEO";

// Lazy-load các Section bên dưới màn hình đầu (Below-the-fold) để giải phóng CPU Mobile
const TimelineSection = lazy(() => import("../../components/HomePage/Timeline"));
const AmbienceSection = lazy(() => import("../../components/HomePage/AmbienceSection"));
const MagazineSection = lazy(() => import("../../components/HomePage/MagazineSection"));
const ContactSection = lazy(() => import("../../components/HomePage/ContactSection"));

const SectionFallback = () => (
  <div className="w-full min-h-[300px] flex items-center justify-center bg-slate-50/50">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#3c6881]" />
  </div>
);

export const HomePage = () => {
  return (
    <>
      <SEO
        title="Nhà Hàng Hải Sản & Ẩm Thực Truyền Thống TP.HCM"
        description="Nhà hàng Hải sản NS Bến Thuyền tại 21S-21T Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM. Trải nghiệm hải sản tươi sống thượng hạng, không gian tiệc sang trọng và di sản ẩm thực từ năm 1955. Hotline: 0909.886.058."
        canonical="/"
      />
      <HeroBanner />
      <main className="flex w-full flex-col bg-white">
        {/* Semantic H1 for SEO without affecting visual design */}
        <h1 className="sr-only">
          Nhà Hàng Hải Sản NS Bến Thuyền - Ẩm Thực Truyền Thống Từ Năm 1955 TP.HCM
        </h1>
        <AboutStory />
        <FoodSlide />
        <MenuSection />

        <Suspense fallback={<SectionFallback />}>
          <TimelineSection />
          <AmbienceSection />
          <MagazineSection />
          <ContactSection />
        </Suspense>
      </main>
    </>
  );
};
