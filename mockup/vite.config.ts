import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/platforma/",
  build: { outDir: mode === "pages" ? "dist-pages" : "dist" },
  plugins: [react(), tailwindcss()],
}));
