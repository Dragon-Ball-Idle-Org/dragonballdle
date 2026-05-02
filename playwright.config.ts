import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry once locally — 2 times on CI */
  retries: process.env.CI ? 2 : 1,
  /* 2 parallel workers locally for ~2x speedup without overloading the dev server */
  workers: process.env.CI ? 1 : 2,
  /* 120s timeout to accommodate slow hydration in Chromium/Mobile emulators */
  timeout: 120_000,
  /* Reporter — don't auto-open browser after run */
  reporter: [["html", { open: "never" }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace only on failures for better debugging with less disk usage */
    trace: "retain-on-failure",

    /* Consistent expect timeout across all assertions */
    testIdAttribute: "data-testid",
    actionTimeout: 30_000,
  },

  expect: {
    timeout: 30_000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "inherit",
    env: {
      NEXT_PUBLIC_CDN_BASE_URL: process.env.NEXT_PUBLIC_CDN_BASE_URL || "",
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "",
      NEXT_PUBLIC_PLAYWRIGHT: 'true',
    },
  },
});
