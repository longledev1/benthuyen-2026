import fs from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const copyWellKnownPlugin = () => ({
  name: "copy-well-known",
  closeBundle() {
    if (fs.existsSync("public/.well-known")) {
      fs.mkdirSync("dist/.well-known", { recursive: true });
      fs.cpSync("public/.well-known", "dist/.well-known", { recursive: true });
    }
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), copyWellKnownPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          supabase: ["@supabase/supabase-js"],
          motion: ["framer-motion"],
          swiper: ["swiper"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
