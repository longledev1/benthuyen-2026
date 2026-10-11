import React from "react";
import AboutStory from "../../components/HomePage/AboutStory";
import FoodSlide from "../../components/HomePage/FoodSlide";
import TimelineSection from "../../components/HomePage/Timeline";
import MenuSection from "../../components/HomePage/MenuSection";
import AmbienceSection from "../../components/HomePage/AmbienceSection";
import MagazineSection from "../../components/HomePage/MagazineSection";
import ContactSection from "../../components/HomePage/ContactSection";
import HeroBanner from "../../components/HeroBanner";
import SEO from "../../components/SEO";

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
        <TimelineSection />
        <MenuSection />
        <AmbienceSection />
        <MagazineSection />
        <ContactSection />
      </main>
    </>
  );
};
