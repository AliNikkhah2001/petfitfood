import { defineConfig, devices } from "@playwright/test";

const BASE = process.env.PETFIT_E2E_BASE || "http://127.0.0.1:5173";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: BASE,
    locale: "fa-IR",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop",
      // channel:chrome uses the system browser — Playwright CDN is geo-blocked in some regions.
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], channel: "chrome" },
    },
  ],
});
