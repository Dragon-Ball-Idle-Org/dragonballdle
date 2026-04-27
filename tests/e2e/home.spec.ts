import { test, expect } from "./fixtures";

test.describe("Home Page", () => {
  test("should load successfully and show game modes", async ({ homePage: page }) => {
    const classicMode = page.getByRole("link", { name: /Clássico|Classic/i }).first();
    await expect(classicMode).toBeVisible();

    const silhouetteMode = page.getByRole("link", { name: /Silhueta|Silhouette/i }).first();
    await expect(silhouetteMode).toBeVisible();
  });

  test("should navigate to Classic mode", async ({ page }) => {
    await page.route("**/api/characters/search*", async (route) => {
      await route.fulfill({ json: [] });
    });
    await page.goto("/en-US/classic");
    await page.waitForLoadState("domcontentloaded");

    const loading = page.locator("#app-loading").first();
    await expect(loading).toHaveClass(/opacity-0/, { timeout: 30000 });

    await expect(page).toHaveURL(/\/classic/);

    const searchInput = page.getByPlaceholder(
      /Digite o nome do personagem|Type character name/i,
    );
    await expect(searchInput).toBeVisible({ timeout: 30000 });
  });

  test("should navigate to Silhouette mode", async ({ page }) => {
    await page.route("**/api/characters/search*", async (route) => {
      await route.fulfill({ json: [] });
    });
    await page.goto("/en-US/silhouette");
    await page.waitForLoadState("domcontentloaded");

    const loading = page.locator("#app-loading").first();
    await expect(loading).toHaveClass(/opacity-0/, { timeout: 30000 });

    await expect(page).toHaveURL(/\/silhouette/);

    const silhouetteHero = page.getByRole("heading", { name: /Silhueta|Silhouette/i }).first();
    await expect(silhouetteHero).toBeVisible({ timeout: 30000 });
  });
});
