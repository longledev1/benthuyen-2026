import { useEffect } from "react";

const BASE_URL = "https://nsbenthuyen.com";
const DEFAULT_TITLE = "NS Bến Thuyền | Nhà Hàng Hải Sản & Ẩm Thực Truyền Thống TP.HCM";
const DEFAULT_DESC =
  "Nhà hàng Hải sản NS Bến Thuyền tại 21S-21T Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM. Trải nghiệm hải sản tươi sống thượng hạng, không gian sảnh tiệc sang trọng và di sản ẩm thực từ năm 1955. Hotline: 0909.886.058.";
const DEFAULT_IMAGE = `${BASE_URL}/images/home/food-1.png`;

export const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = "website",
  schema,
  noindex = false,
}) => {
  useEffect(() => {
    // 1. Cập nhật Document Title
    const finalTitle = title ? `${title} | NS Bến Thuyền` : DEFAULT_TITLE;
    document.title = finalTitle;

    // Helper cập nhật hoặc tạo meta tag
    const setMeta = (selector, attributeName, attributeValue, content) => {
      if (!content) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attributeName, attributeValue);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const finalDesc = description || DEFAULT_DESC;
    const finalImage = ogImage
      ? ogImage.startsWith("http")
        ? ogImage
        : `${BASE_URL}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`
      : DEFAULT_IMAGE;
    const finalCanonical = canonical
      ? canonical.startsWith("http")
        ? canonical
        : `${BASE_URL}${canonical.startsWith("/") ? "" : "/"}${canonical}`
      : window.location.href;

    // 2. Robots tag (noindex / follow)
    if (noindex) {
      setMeta('meta[name="robots"]', "name", "robots", "noindex, nofollow");
    } else {
      setMeta(
        'meta[name="robots"]',
        "name",
        "robots",
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      );
    }

    // 3. Cập nhật Meta Description & Keywords
    setMeta('meta[name="description"]', "name", "description", finalDesc);
    if (keywords) {
      setMeta('meta[name="keywords"]', "name", "keywords", keywords);
    }

    // 4. Cập nhật Open Graph (Facebook / Zalo / Telegram)
    setMeta('meta[property="og:title"]', "property", "og:title", finalTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", finalDesc);
    setMeta('meta[property="og:image"]', "property", "og:image", finalImage);
    setMeta('meta[property="og:url"]', "property", "og:url", finalCanonical);
    setMeta('meta[property="og:type"]', "property", "og:type", ogType);

    // 5. Cập nhật Twitter Card
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", finalTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", finalDesc);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", finalImage);

    // 6. Cập nhật Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", finalCanonical);

    // 7. Cập nhật hoặc chèn dynamic JSON-LD Schema
    const schemaScriptId = "dynamic-seo-schema";
    let schemaScript = document.getElementById(schemaScriptId);
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.id = schemaScriptId;
        schemaScript.type = "application/ld+json";
        document.head.appendChild(schemaScript);
      }
      schemaScript.text = JSON.stringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }

    // Cleanup khi unmount
    return () => {
      const scriptToRemove = document.getElementById(schemaScriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
      if (noindex) {
        setMeta(
          'meta[name="robots"]',
          "name",
          "robots",
          "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        );
      }
    };
  }, [title, description, keywords, canonical, ogImage, ogType, schema, noindex]);

  return null;
};

export default SEO;
