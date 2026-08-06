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
      <div className={showIntro ? "opacity-0 h-0 overflow-hidden" : "opacity-100 transition-opacity duration-1000"}>
        <RouterProvider router={router} />
      </div>
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <MainApp />
);
