import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GALLERY_CATEGORIES } from "../../data/galleryData";
import GalleryGrid from "../../components/Gallery/GalleryGrid";

export const GalleryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [hoveredPanel, setHoveredPanel] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Tìm category tương ứng dựa trên slug
  const selectedCategory = slug
    ? GALLERY_CATEGORIES.find(
        (c) =>
          c.slug === decodeURIComponent(slug) ||
          c.id === slug ||
          c.slug === slug,
      )
    : null;

  // Thêm ký số La Mã cho các cột
  const romanNumerals = ["I", "II", "III"];

  return (
    <div
      className={`relative w-full transition-all duration-500 select-none ${
        selectedCategory !== null
          ? "min-h-screen overflow-y-auto"
          : "md:h-screen md:overflow-hidden min-h-screen overflow-y-auto bg-black"
      }`}
    >
      <AnimatePresence mode="wait">
        {selectedCategory === null ? (
          <motion.div
            key="split-panels"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex min-h-[calc(100vh-70px)] md:h-full w-full flex-col md:flex-row"
          >
            {GALLERY_CATEGORIES.map((category, index) => {
              const isHovered = hoveredPanel === index;
              const isAnyHovered = hoveredPanel !== null;
              const isOtherHovered = isAnyHovered && !isHovered;

              return (
                <div
                  key={category.id}
                  onMouseEnter={() => {
                    if (!isMobile) setHoveredPanel(index);
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) setHoveredPanel(null);
                  }}
                  onClick={() => navigate(`/gallery/${category.slug}`)}
                  className="relative flex h-[35vh] min-h-[250px] md:h-full flex-1 cursor-pointer items-center justify-center overflow-hidden border-b border-white/10 transition-all duration-700 ease-out md:border-b-0"
                  style={{
                    flexGrow: isMobile ? 1 : (isHovered ? 2.0 : isOtherHovered ? 0.5 : 1),
                  }}
                >
                  {/* Background Image */}
                  <div
                    className="absolute -inset-6 bg-cover bg-center transition-all duration-700 ease-out"
                    style={{
                      backgroundImage: `url('${category.coverImage}')`,
                      filter: !isMobile && isOtherHovered
                        ? "grayscale(40%) blur(2px)"
                        : "none",
                      transform: !isMobile && isHovered ? "scale(1.05)" : "scale(1)",
                      willChange: "transform, filter",
                    }}
                  />

                  {/* Dark Overlays */}
                  <div
                    className="absolute inset-0 bg-black transition-opacity duration-700 ease-out"
                    style={{
                      opacity: isMobile ? 0.45 : (isHovered ? 0.35 : isOtherHovered ? 0.75 : 0.55),
                    }}
                  />

                  {/* Top-to-bottom subtle gradient overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

                  {/* Content Container */}
                  <div className="relative z-10 flex h-full w-full flex-col items-center justify-between p-6 text-center md:p-12">
                    {/* Top element: Roman Numeral */}
                    <div
                      className="font-normalt text-secondary font-serif text-lg tracking-[0.3em] transition-all duration-500 ease-out sm:text-xl"
                      style={{
                        transform: isMobile || isHovered
                          ? "translateY(0)"
                          : "translateY(-8px)",
                        opacity: !isMobile && isOtherHovered ? 0.4 : 1,
                      }}
                    >
                      {romanNumerals[index]}
                    </div>

                    {/* Center element: Typography and Description */}
                    <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center">
                      {/* Serif Category Title */}
                      <h2
                        className="font-serif text-2xl whitespace-nowrap text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] transition-all duration-500 ease-out sm:text-3xl md:text-4xl lg:text-[40px]"
                        style={{
                          transform: !isMobile && isHovered ? "scale(1.04)" : "scale(1)",
                          letterSpacing: isMobile || isHovered ? "0.22em" : "0.15em",
                        }}
                      >
                        {category.mainTitle}
                        {category.subTitle && (
                          <span className="font-normalt mt-1 block font-sans text-sm tracking-[0.2em] text-white sm:mt-2 sm:text-base md:text-lg">
                            {category.subTitle}
                          </span>
                        )}
                      </h2>

                      {/* Line divider */}
                      <div
                        className="bg-secondary my-4 h-[1px] transition-all duration-500 ease-out sm:my-6"
                        style={{
                          width: isMobile || isHovered ? "80px" : "40px",
                          opacity: !isMobile && isOtherHovered ? 0.3 : 1,
                        }}
                      />

                      {/* Expandable Tagline / Description */}
                      <div
                        className="font-normalt overflow-hidden font-sans text-xs leading-relaxed tracking-wider text-gray-200 drop-shadow-md transition-all duration-500 ease-out sm:text-sm"
                        style={{
                          opacity: isMobile || isHovered ? 1 : 0,
                          maxHeight: isMobile || isHovered ? "120px" : "0px",
                          marginTop: isMobile || isHovered ? "0px" : "-10px",
                          visibility: isMobile || isHovered ? "visible" : "hidden",
                        }}
                      >
                        {category.desc}
                      </div>
                    </div>

                    {/* Bottom element: Call to Action / Explore button */}
                    <div className="flex h-12 items-center justify-center">
                      <div
                        className="border-secondary text-secondary hover:bg-secondary rounded-full border px-6 py-2 text-[11px] font-medium tracking-[0.25em] uppercase transition-all duration-500 ease-out hover:text-black"
                        style={{
                          opacity: isMobile || isHovered ? 1 : 0,
                          transform: isMobile || isHovered
                            ? "translateY(0)"
                            : "translateY(12px)",
                          visibility: isMobile || isHovered ? "visible" : "hidden",
                        }}
                      >
                        Khám Phá
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="category-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen w-full"
          >
            <GalleryGrid
              category={selectedCategory}
              onBack={() => navigate("/gallery")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
