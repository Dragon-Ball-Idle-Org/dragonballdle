import { test, expect } from "./fixtures";

test.describe("Home Page", () => {
  test("should load successfully and show game modes", async ({ homePage: page }) => {
    // Check for game mode buttons
    const classicMode = page.getByRole("link", { name: /Clássico|Classic/i }).first();
    await expect(classicMode).toBeVisible();

    const silhouetteMode = page.getByRole("link", { name: /Silhueta|Silhouette/i }).first();
    await expect(silhouetteMode).toBeVisible();
  });

  test("should navigate to Classic mode", async ({ homePage: page }) => {
    // Ensure hydration is complete
    await page.waitForLoadState("domcontentloaded");

    // Target the link specifically in the main content area to avoid mobile menu duplicates
    const classicModeLink = page.locator('main a[href*="/classic"]').first();
    await classicModeLink.waitFor({ state: "attached" });
    await classicModeLink.dispatchEvent("click");
 
    await expect(page).toHaveURL(/.*\/classic/, { timeout: 30000 });

    const searchInput = page.locator("input.guess-input").first();
    await searchInput.waitFor({ state: "visible", timeout: 60000 });
    await expect(searchInput).toBeVisible();
  });

  test("should navigate to Silhouette mode", async ({ homePage: page }) => {
    await page.waitForLoadState("domcontentloaded");

    const silhouetteModeLink = page.locator('main a[href*="/silhouette"]').first();
    await silhouetteModeLink.waitFor({ state: "attached" });
    await silhouetteModeLink.dispatchEvent("click");
 
    await expect(page).toHaveURL(/.*\/silhouette/, { timeout: 30000 });

    const silhouetteHero = page.getByRole("heading", { name: /Silhueta|Silhouette/i }).first();
    await silhouetteHero.waitFor({ state: "visible", timeout: 60000 });
    await expect(silhouetteHero).toBeVisible();
  });
});
