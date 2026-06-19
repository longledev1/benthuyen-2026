import React from "react";
import AboutStory from "../../components/HomePage/AboutStory";
import FoodSlide from "../../components/HomePage/FoodSlide";
import TimelineSection from "../../components/HomePage/Timeline";
import MenuSection from "../../components/HomePage/MenuSection";
import AmbienceSection from "../../components/HomePage/AmbienceSection";
import FeedbackSection from "../../components/HomePage/FeedbackSection";
import ContactSection from "../../components/HomePage/ContactSection";
import HeroBanner from "../../components/HeroBanner";

export const HomePage = () => {
  return (
    <>
      <HeroBanner />
      <main className="flex w-full flex-col bg-white">
        <section className="mt-12 mb-12 md:mt-24 md:mb-24">
          <AboutStory />
        </section>

        <section className="mb-12 md:mb-24">
          <TimelineSection />
        </section>

        <section className="mb-12 md:mb-24">
          <FoodSlide />
        </section>

        <section className="mb-12 md:mb-24">
          <MenuSection />
        </section>

        <section className="mb-12 md:mb-24">
          <AmbienceSection />
        </section>

        <section className="mb-12 md:mb-24">
          <FeedbackSection />
        </section>

        <section className="mb-12 md:mb-24">
          <ContactSection />
        </section>
      </main>
    </>
  );
};
