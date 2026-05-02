import { test, expect } from "./fixtures";

test.describe("Ad Banners", () => {
  test("should load footer ad container on all viewports", async ({ homePage: page }) => {
    // The homePage fixture automatically navigates and the server provides the mock
    const footerAdBanner = page.locator("#ad-banner-footer").first();
    await expect(footerAdBanner).toBeVisible();

    // Check that the iframe has loaded the mock document from the server
    const footerFrame = footerAdBanner.frameLocator("iframe");
    await expect(footerFrame.locator("body")).toBeAttached();
  });

  test("should load sidebar ad containers on desktop", async ({ homePage: page }) => {
    // This test should only run on viewports wider than the mobile breakpoint
    test.skip(page.viewportSize().width < 1280, "Sidebar ads are only visible on desktop");

    // Check the left sidebar banner
    const leftAdBanner = page.locator("#ad-banner-left").first();
    await expect(leftAdBanner).toBeVisible();
    const leftFrame = leftAdBanner.frameLocator("iframe");
    await expect(leftFrame.locator("body")).toBeAttached();
    
    // Check the right sidebar banner
    const rightAdBanner = page.locator("#ad-banner-right").first();
    await expect(rightAdBanner).toBeVisible();
    const rightFrame = rightAdBanner.frameLocator("iframe");
    await expect(rightFrame.locator("body")).toBeAttached();
  });
});
