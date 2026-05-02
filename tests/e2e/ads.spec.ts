import { test, expect } from "./fixtures";

test.describe("Ad Banners", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the ad proxy to return a predictable HTML document
    await page.route("**/api/ad-proxy*", async (route) => {
      const url = new URL(route.request().url());
      const src = url.searchParams.get("src") || "";
      const zoneId = new URL(src).searchParams.get("zoneid") || "unknown";

      await route.fulfill({
        contentType: "text/html",
        body: `
          <!DOCTYPE html>
          <html>
            <head><title>Mock Ad</title></head>
            <body>
              <h1>Mock Ad for Zone ${zoneId}</h1>
            </body>
          </html>
        `,
      });
    });
  });

  test("should load and display mock ads on the home page", async ({ homePage: page }) => {
    // The homePage fixture automatically navigates to the page
    
    // 1. Check the bottom footer banner
    const footerAdBanner = page.locator("#ad-banner-footer").first();
    await expect(footerAdBanner).toBeVisible();

    // Check the iframe inside the footer banner
    const footerFrame = footerAdBanner.frameLocator("iframe");
    await expect(footerFrame.locator("h1")).toHaveText("Mock Ad for Zone 11261426");
    
    // 2. Check the left sidebar banner (only visible on larger screens)
    const leftAdBanner = page.locator("#ad-banner-left").first();
    await expect(leftAdBanner).toBeVisible(); // This will only pass on desktop viewport

    // Check the iframe inside the left banner
    const leftFrame = leftAdBanner.frameLocator("iframe");
    await expect(leftFrame.locator("h1")).toHaveText("Mock Ad for Zone 11259050");
    
    // 3. Check the right sidebar banner (only visible on larger screens)
    const rightAdBanner = page.locator("#ad-banner-right").first();
    await expect(rightAdBanner).toBeVisible(); // This will only pass on desktop viewport

    // Check the iframe inside the right banner
    const rightFrame = rightAdBanner.frameLocator("iframe");
    await expect(rightFrame.locator("h1")).toHaveText("Mock Ad for Zone 11261446");
  });
});
