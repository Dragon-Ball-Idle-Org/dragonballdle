import { test } from "./fixtures";

test.describe("Ad Banners", () => {
  // NOTE: Ad tests commented out since ads were intentionally removed from the application
  // If ads are re-enabled, uncomment these tests and ensure the ad containers are present in the layout
  /*
  test.beforeEach(async ({ page }) => {
    // Mock AdsTerra
    await page.route("https://www.highperformanceformat.com/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: `
          // Mock AdsTerra script
          console.log('AdsTerra script mocked!');
          window.atOptions = window.atOptions || {}; // Ensure atOptions exists
          // For simplicity, we don't inject any actual ad content, just ensure the script loads.
          // The component's container should still be visible.
        `,
      });
    });

    // Mock AdCash
    await page.route("https://acscdn.com/script/aclib.js", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: `
          // Mock AdCash script
          console.log('AdCash script mocked!');
          window.aclib = {
            runBanner: ({ zoneId }) => {
              console.log('Mock aclib.runBanner called for zoneId:', zoneId);
              const container = document.querySelector('[data-testid="adcash-container-right"]'); // Target the specific data-testid
              if (container) {
                container.innerHTML = \`<div style="width:160px;height:600px;background-color:#ccc;display:flex;align-items:center;justify-content:center;">Mock AdCash Ad for \${zoneId}</div>\`;
              }
            },
          };
        `,
      });
    });
  });

  test("should load footer ad container on all viewports", async ({ homePage: page }) => {
    // The test now only checks if the container for the ad is visible.
    // The ad itself is not loaded in the test environment.
    const footerAdBanner = page.getByTestId("adsterra-container-footer");
    await expect(footerAdBanner).toBeVisible();
  });

  test("should load sidebar ad containers on desktop", async ({ homePage: page }) => {
    // This test should only run on viewports wider than the mobile breakpoint
    // Using page.isMobile() from fixtures.ts which relies on 'viewport' configured in playwright.config.ts
    test.skip(page.viewportSize().width < 1280, "Sidebar ads are only visible on desktop");

    // Check the left sidebar banner
    const leftAdBanner = page.getByTestId("adsterra-container-left");
    await expect(leftAdBanner).toBeVisible();

    // Check the right sidebar banner
    const rightAdBanner = page.getByTestId("adcash-container-right");
    await expect(rightAdBanner).toBeVisible();
  });
  */
});
