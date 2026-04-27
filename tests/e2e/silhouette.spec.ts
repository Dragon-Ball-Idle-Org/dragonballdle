import { test, expect } from "./fixtures";

test.describe("Silhouette Game Mode", () => {
  test("should display the silhouette game interface", async ({ silhouettePage: page }) => {
    const searchInput = page.getByPlaceholder(
      /Digite o nome do personagem|Type character name/i,
    );
    await expect(searchInput).toBeVisible();

    const heroTitle = page.getByText(/Revele a Silhueta|Reveal the Silhouette/i);
    await expect(heroTitle).toBeVisible();

    const imageViewer = page.locator('[data-testid="silhouette-viewer"]');
    // The image viewer should be visible if the daily character is loaded
    await expect(imageViewer).toBeVisible();
  });

  test("should search and show suggestions in silhouette mode", async ({
    silhouettePage: page,
  }) => {
    const searchInput = page.getByPlaceholder(
      /Digite o nome do personagem|Type character name/i,
    );

    await searchInput.pressSequentially("Goku", { delay: 30 });

    const suggestionsPortal = page.getByRole("listbox");
    await expect(suggestionsPortal).toBeVisible();

    const suggestionItem = page.getByRole("option").first();
    await expect(suggestionItem).toBeVisible();
    await expect(suggestionItem).toContainText(/Goku/i);
  });

  test("should submit a guess and show it in the list", async ({
    silhouettePage: page,
  }) => {
    const searchInput = page.getByPlaceholder(
      /Digite o nome do personagem|Type character name/i,
    );

    // Make an incorrect guess (Vegeta)
    await searchInput.fill("Vegeta");
    
    // Wait for suggestions to appear
    await expect(page.getByRole("listbox")).toBeVisible();
    
    // Select via keyboard
    await searchInput.press("ArrowDown");
    await searchInput.press("Enter");

    // Verify guess appears in the list
    const guessImage = page.locator(`img[alt="Vegeta"]`).first();
    await expect(guessImage).toBeVisible({ timeout: 15000 });
    
    // Verify guess count increased in the viewer (localized check)
    const guessCount = page.getByText(/palpite|guess/i).first();
    await expect(guessCount).toBeVisible();
    await expect(guessCount).toContainText("1");
  });

  test("should persist silhouette guesses after page refresh", async ({
    silhouettePage: page,
  }) => {
    const searchInput = page.getByPlaceholder(
      /Digite o nome do personagem|Type character name/i,
    );

    // Make a guess
    await searchInput.fill("Vegeta");
    await expect(page.getByRole("listbox")).toBeVisible();
    await searchInput.press("ArrowDown");
    await searchInput.press("Enter");
    
    // Verify guess is there
    const guessImage = page.locator(`img[alt="Vegeta"]`).first();
    await expect(guessImage).toBeVisible({ timeout: 15000 });

    // Verify localStorage was written
    await page.waitForFunction(() => {
      const raw = localStorage.getItem("dragonballdle:guesses:silhouette");
      if (!raw) return false;
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed.value) && parsed.value.length > 0;
      } catch {
        return false;
      }
    }, null, { timeout: 10000 });

    // Reload — 'load' is safer than 'networkidle' when WebSockets (realtime) are active
    await page.reload({ waitUntil: "load" });

    // Wait for splash screen to dismiss
    const loading = page.locator("#app-loading").first();
    await expect(loading).toHaveClass(/opacity-0/, { timeout: 30000 });

    // Wait for the dynamic guess list to hydrate with the persisted guess
    await page.waitForFunction(
      (name) => {
        const imgs = Array.from(document.querySelectorAll(`img[alt="${name}"]`));
        return imgs.some((img) => img.getBoundingClientRect().width > 0);
      },
      "Vegeta",
      { timeout: 45000 },
    );

    // Verify guess persisted
    await expect(page.locator(`img[alt="Vegeta"]`).first()).toBeVisible({ timeout: 15000 });
  });
});
