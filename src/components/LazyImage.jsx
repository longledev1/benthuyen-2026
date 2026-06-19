import React, { useState, useEffect, useRef } from "react";

// Ảnh SVG placeholder mặc định mang phong cách tối giản, sang trọng với tone màu vàng kim (#cfb26e) và navy (#131924) của NS Bến Thuyền
const PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%"><rect width="400" height="300" fill="%23131924"/><g fill="none" stroke="%23cfb26e" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" opacity="0.6"><rect x="160" y="100" width="80" height="60" rx="4"/><circle cx="180" cy="120" r="6"/><path d="M160 145l20-20 25 25 15-15 20 20"/></g><text x="50%" y="195" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="11" fill="%23cfb26e" letter-spacing="3" opacity="0.7">NS BẾN THUYỀN</text></svg>`;

/**
 * LazyImage Component
 * @param {string} src - Đường dẫn hình ảnh
 * @param {string} alt - Văn bản thay thế cho ảnh
 * @param {string} className - Lớp CSS áp dụng cho thẻ img thực tế (ví dụ: object-cover, hover:scale-105)
 * @param {string} containerClassName - Lớp CSS áp dụng cho thẻ div bọc ngoài (chứa Skeleton)
 * @param {object} props - Các props truyền thêm cho thẻ img
 */
export const LazyImage = ({
  src,
  alt = "",
  className = "",
  containerClassName = "",
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src || PLACEHOLDER_IMAGE);
  const [isLoaded, setIsLoaded] = useState(src ? false : true); // Nếu không có src ngay từ đầu, coi như đã load xong (dùng placeholder)
  const imgRef = useRef(null);

  // Theo dõi sự thay đổi của prop src để cập nhật lại ảnh nguồn
  useEffect(() => {
    if (src) {
      setImageSrc(src);
      setIsLoaded(false);
    } else {
      setImageSrc(PLACEHOLDER_IMAGE);
      setIsLoaded(true); // Không có src -> hiển thị placeholder ngay lập tức
    }
  }, [src]);

  // Kiểm tra ảnh đã được cache sẵn trong trình duyệt chưa để kích hoạt hiển thị ngay
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, [imageSrc]);

  // Xử lý khi ảnh thật gặp lỗi tải
  const handleError = () => {
    setImageSrc(PLACEHOLDER_IMAGE);
    setIsLoaded(true); // Coi như đã tải xong ảnh placeholder để tắt hiệu ứng loading/spinner
  };

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-neutral-200/40 select-none ${containerClassName}`}
    >
      {/* Skeleton / Loading Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-neutral-200">
          {/* Spinner nhỏ màu vàng kim tinh tế */}
          <div className="border-t-secondary h-5 w-5 animate-spin rounded-full border-[2px] border-neutral-300" />
        </div>
      )}

      {/* Actual Image */}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`h-full w-full transition-all duration-700 ease-out ${className} ${
          isLoaded ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default LazyImage;
