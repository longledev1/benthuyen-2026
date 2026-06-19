import React from "react";
import AboutHeroBanner from "../../components/HeroBanner/AboutHeroBanner";
import OurJourney from "../../components/AboutPage/OurJourney";
import CulinaryPhilosophy from "../../components/AboutPage/CulinaryPhilosophy";
import BrandPhilosophy from "../../components/AboutPage/BrandPhilosophy";
import RestaurantSlider from "../../components/AboutPage/RestaurantSlider";
import CoreValues from "../../components/AboutPage/CoreValues";
import ContinueStory from "../../components/AboutPage/ContinueStory";

const AboutPage = () => {
    return (
        <>
            <AboutHeroBanner />
            <main className="flex w-full flex-col bg-white">
                <OurJourney></OurJourney>
                <RestaurantSlider></RestaurantSlider>
                <BrandPhilosophy></BrandPhilosophy>
                <CulinaryPhilosophy></CulinaryPhilosophy>
                <CoreValues></CoreValues>
                <ContinueStory></ContinueStory>
            </main>
        </>
    );
};

export default AboutPage;