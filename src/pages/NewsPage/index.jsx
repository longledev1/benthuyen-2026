import React from "react";
import { motion } from "framer-motion";
import NewsHeroBanner from "../../components/HeroBanner/NewsHeroBanner";
import NewsCollageSection from "../../components/NewsCollageSection";
import NewsGridSection from "../../components/NewsGridSection";
import SEO from "../../components/SEO";

export const NewsPage = () => {
  return (
    <>
      <SEO
        title="Góc Chuyện Trò - Bản Tin & Văn Hóa Ẩm Thực"
        description="Cập nhật những sự kiện ẩm thực mới nhất, văn hóa thưởng thức hải sản và ưu đãi tiệc đặc biệt tại nhà hàng NS Bến Thuyền."
        canonical="/news"
      />
      {/* Hero Banner */}
      <NewsHeroBanner />

      {/* Main Content Area in Light Theme */}
      <div className="flex w-full flex-col items-center border-t border-black/5 px-6 py-20 md:px-12">
        <div className="flex w-full max-w-[1400px] flex-col items-center">
          <div className="mb-16 overflow-hidden text-center select-none">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="text-secondary font-kanit text-5xl leading-none font-bold uppercase md:text-6xl"
            >
              Góc chuyện trò
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="text-primary font-script -mt-6 text-4xl leading-none md:text-7xl"
            >
              Bến Thuyền
            </motion.h3>
          </div>

          {/* Collage & Card Content Component */}
          <NewsCollageSection />

          {/* NEWS */}
          <NewsGridSection />
        </div>
      </div>
    </>
  );
};

export default NewsPage;
