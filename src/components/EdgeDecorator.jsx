import React from "react";

const DECORATION_ASSETS = {
  palm: "/images/decorations/palm_leaf.png",
  starfish: "/images/decorations/starfish_gold.png",
  coral: "/images/decorations/coral_gold.png",
  hoagiay: "/images/decorations/hoagiay.png",
  sanho: "/images/decorations/sanho.png",
};

const POSITION_CLASSES = {
  "top-left": "top-0 left-0 origin-top-left",
  "top-right": "top-0 right-0 origin-top-right",
  "bottom-left": "bottom-0 left-0 origin-bottom-left",
  "bottom-right": "bottom-0 right-0 origin-bottom-right",
};

export const EdgeDecorator = ({
  type,
  position,
  className = "",
  float = true,
}) => {
  const imgSrc = DECORATION_ASSETS[type];
  const posClass = POSITION_CLASSES[position];

  if (!imgSrc) return null;

  // Lựa chọn class chuyển động đung đưa hoặc trôi nổi bồng bềnh
  let animationClass = "";
  if (float) {
    animationClass =
      type === "palm" ? "animate-sway-slow" : "animate-float-slow";
  }

  return (
    <div
      className={`absolute ${posClass} pointer-events-none z-10 hidden select-none md:block ${animationClass} ${className}`}
    >
      <img
        src={imgSrc}
        alt={`${type} decoration`}
        className="h-auto w-full object-contain opacity-80"
        loading="lazy"
      />
    </div>
  );
};

export default EdgeDecorator;
