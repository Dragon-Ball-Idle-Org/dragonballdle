import { test, expect } from "./fixtures";

test.describe("Classic Game Mode", () => {
  test("should display the classic game interface", async ({ classicPage: page }) => {
    const searchInput = page.getByPlaceholder(
      /Digite o nome do personagem|Type character name/i,
    );
    await expect(searchInput).toBeVisible();

    const guideHeader = page.getByText(
      /Precisa de um guia rápido|Need a quick guide/i,
    );
    await expect(guideHeader).toBeVisible();
  });

  test("should search for a character and show suggestions", async ({
    classicPage: page,
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

  test("should submit a guess and display it in the table", async ({
    classicPage: page,
  }) => {
    const searchInput = page.getByPlaceholder(
      /Digite o nome do personagem|Type character name/i,
    );

    await searchInput.pressSequentially("Goku", { delay: 30 });

    const firstSuggestion = page.getByRole("option").first();
    const suggestionName = await firstSuggestion.innerText();
    await firstSuggestion.click();

    const guessImage = page.locator(
      `img[alt="${suggestionName.trim()}"]`,
    ).first();
    await expect(guessImage).toBeVisible();
  });

  test("should persist guesses after page refresh", async ({
    classicPage: page,
  }) => {
    const searchInput = page.getByPlaceholder(
      /Digite o nome do personagem|Type character name/i,
    );

    // Make a guess
    await searchInput.pressSequentially("Vegeta", { delay: 30 });
    const firstSuggestion = page.getByRole("option").first();
    const suggestionName = await firstSuggestion.innerText();
    await firstSuggestion.click();

    // Verify guess is there
    await expect(
      page.locator(`img[alt="${suggestionName.trim()}"]`).first(),
    ).toBeVisible();

    // Verify localStorage was written before reloading
    await page.waitForFunction(() => {
      const raw = localStorage.getItem("dragonballdle:guesses:classic");
      if (!raw) return false;
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed.value) && parsed.value.length > 0;
      } catch {
        return false;
      }
    }, null, { timeout: 5000 });

    // Reload the page
    await page.reload({ waitUntil: "load" });

    // Wait for the loading screen to disappear
    const loadingAfterReload = page.locator("#app-loading").first();
    await expect(loadingAfterReload).toHaveClass(/opacity-0/, { timeout: 30000 });

    // Wait for React to re-render the guesses table with hydrated data
    await page.waitForFunction(
      (name) => {
        const imgs = Array.from(document.querySelectorAll(`img[alt="${name}"]`));
        return imgs.some((img) => img.getBoundingClientRect().width > 0);
      },
      suggestionName.trim(),
      { timeout: 30000 },
    );

    await expect(
      page.locator(`img[alt="${suggestionName.trim()}"]`).first(),
    ).toBeVisible();
  });
});
