import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate and wait for the locale redirect to happen
    await page.goto("/");
    // Wait for the loading screen to disappear (fade out)
    const loading = page.locator("#app-loading");
    await expect(loading).toHaveClass(/opacity-0/, { timeout: 30000 });
  });

  test("should load successfully and show game modes", async ({ page }) => {
    // Check if the title is present
    const logo = page.locator('img[alt*="Logo"]');
    if (await logo.isVisible()) {
        await expect(logo).toBeVisible();
    }

    // Check for game mode buttons
    const classicMode = page.getByRole("link", { name: /Clássico|Classic/i });
    await expect(classicMode).toBeVisible();

    const silhouetteMode = page.getByRole("link", { name: /Silhueta|Silhouette/i });
    await expect(silhouetteMode).toBeVisible();
  });

  test("should navigate to Classic mode", async ({ page }) => {
    const classicModeLink = page.getByRole("link", { name: /Clássico|Classic/i });
    await classicModeLink.click();

    // Check if the URL has changed (flexible enough for locale prefix)
    await page.waitForURL(/.*\/classic/);
    await expect(page.url()).toContain("/classic");
    
    // Check if the game board is visible
    const searchInput = page.getByPlaceholder(/character name|nome do personagem/i);
    await expect(searchInput).toBeVisible();
  });

  test("should navigate to Silhouette mode", async ({ page }) => {
    const silhouetteModeLink = page.getByRole("link", { name: /Silhueta|Silhouette/i });
    await silhouetteModeLink.click();

    // Check if the URL has changed
    await page.waitForURL(/.*\/silhouette/);
    await expect(page.url()).toContain("/silhouette");
    
    // Check if the silhouette viewer is visible
    const silhouetteHero = page.getByRole("heading", { name: /Silhueta|Silhouette/i });
    await expect(silhouetteHero).toBeVisible();
  });
});
