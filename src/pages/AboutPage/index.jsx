import React from "react";
import AboutHeroBanner from "../../components/HeroBanner/AboutHeroBanner";
import OurJourney from "../../components/AboutPage/OurJourney";
import CulinaryPhilosophy from "../../components/AboutPage/CulinaryPhilosophy";
import BrandPhilosophy from "../../components/AboutPage/BrandPhilosophy";
import RestaurantSlider from "../../components/AboutPage/RestaurantSlider";
import CoreValues from "../../components/AboutPage/CoreValues";
import ContinueStory from "../../components/AboutPage/ContinueStory";
import SEO from "../../components/SEO";

const AboutPage = () => {
    return (
        <>
            <SEO
                title="Khởi Nguyên - Câu Chuyện Di Sản Từ Năm 1955"
                description="Khám phá hành trình hơn 70 năm gìn giữ di sản ẩm thực hải sản truyền thống của NS Bến Thuyền. Tinh hoa đại dương kết hợp kiến trúc Indochine sang trọng tại TP.HCM."
                canonical="/gioi-thieu"
            />
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