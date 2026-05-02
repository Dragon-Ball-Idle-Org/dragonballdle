import { test, expect } from "./fixtures";

test.describe("Ad Banners", () => {
  test("should load footer ad container on all viewports", async ({ homePage: page }) => {
    // The test now only checks if the container for the ad is visible.
    // The ad itself is not loaded in the test environment.
    const footerAdBanner = page.getByTestId("adsterra-container-footer");
    await expect(footerAdBanner).toBeVisible();
  });

  test("should load sidebar ad containers on desktop", async ({ homePage: page }) => {
    // This test should only run on viewports wider than the mobile breakpoint
    test.skip(page.viewportSize().width < 1280, "Sidebar ads are only visible on desktop");

    // Check the left sidebar banner
    const leftAdBanner = page.getByTestId("adsterra-container-left");
    await expect(leftAdBanner).toBeVisible();
    
    // Check the right sidebar banner
    const rightAdBanner = page.getByTestId("adcash-container-right");
    await expect(rightAdBanner).toBeVisible();
  });
});
