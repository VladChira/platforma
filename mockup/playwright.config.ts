import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  use: { headless: true },
  projects: [
    { name: "docker", use: { baseURL: "http://127.0.0.1:5173" } },
    { name: "pages", use: { baseURL: "http://127.0.0.1:5174" } },
  ],
  webServer: [
    {
      command: "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort",
      url: "http://127.0.0.1:5173/platforma/",
      reuseExistingServer: false,
    },
    {
      command: "npm run build:pages && node e2e/pages-server.cjs",
      url: "http://127.0.0.1:5174/platforma/",
      reuseExistingServer: false,
    },
  ],
});
