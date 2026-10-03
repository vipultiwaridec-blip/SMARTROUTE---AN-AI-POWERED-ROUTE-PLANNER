import { defineConfig } from "@playwright/test";

// End-to-end tests run against a real Supabase project with the sample logins (npm run seed:users) and a
// running app (npm run dev). They use the installed Chrome, so no browser download is needed.
process.loadEnvFile(".env.local");

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 120_000,
  workers: 1, // tests share one database
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    channel: "chrome",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000/login",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
