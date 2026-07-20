import React from "react";
import AboutStory from "../../components/HomePage/AboutStory";
import FoodSlide from "../../components/HomePage/FoodSlide";
import TimelineSection from "../../components/HomePage/Timeline";
import MenuSection from "../../components/HomePage/MenuSection";
import AmbienceSection from "../../components/HomePage/AmbienceSection";
import MagazineSection from "../../components/HomePage/MagazineSection";
import ContactSection from "../../components/HomePage/ContactSection";
import HeroBanner from "../../components/HeroBanner";

export const HomePage = () => {
  return (
    <>
      <HeroBanner />
      <main className="flex w-full flex-col bg-white">
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
