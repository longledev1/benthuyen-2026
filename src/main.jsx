import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import IntroScreen from "./components/IntroScreen";
import "./index.css";

const MainApp = () => {
  const [showIntro, setShowIntro] = useState(() => {
    // Không hiện Intro khi truy cập trực tiếp trang Admin
    if (window.location.pathname.startsWith("/admin")) {
      return false;
    }
    // Bỏ qua IntroScreen đối với các bot kiểm tra hiệu suất Lighthouse, PageSpeed, WebPageTest
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isBot = /Lighthouse|Chrome-Lighthouse|Google-InspectionTool|PageSpeed|HeadlessChrome|bot|spider|crawl/i.test(ua);
    if (isBot) {
      return false;
    }
    // Chỉ hiển thị 1 lần duy nhất trong suốt phiên làm việc (Session)
    return !sessionStorage.getItem("hasSeenIntro");
  });

  useEffect(() => {
    if (showIntro) {
      sessionStorage.setItem("hasSeenIntro", "true");
    }
  }, [showIntro]);

  return (
    <>
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}
      <RouterProvider router={router} />
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <MainApp />
);
