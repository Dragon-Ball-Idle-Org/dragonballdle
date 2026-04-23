import { test, expect } from "@playwright/test";

test.describe("Classic Game Mode", () => {
  test.beforeEach(async ({ page }) => {
    /** 
     * NOTE: Client-side mocks for Supabase and Search API.
     * These help make tests deterministic and work even if the backend has issues.
     * However, the server-side initial load still depends on the environment.
     */
    
    // Mock characters search API
    await page.route("**/api/characters/search*", async (route) => {
      const json = [
        { slug: "goku", name: "Goku", thumb_path: "/characters/goku-thumb.png" },
        { slug: "vegeta", name: "Vegeta", thumb_path: "/characters/vegeta-thumb.png" },
      ];
      await route.fulfill({ json });
    });

    // Mock individual character fetch for guess processing
    await page.route("**/rest/v1/characters*", async (route) => {
      const url = new URL(route.request().url());
      const slug = url.searchParams.get("slug")?.replace("eq.", "");
      
      const characters: Record<string, any> = {
        goku: {
          slug: "goku",
          name: "Goku",
          thumb_path: "/characters/goku-thumb.png",
          gender: { slug: "male", name: "Masculino" },
          series: { slug: "dragon-ball-z", name: "Dragon Ball Z" },
          debut_saga: { slug: "saiyan-saga", name: "Saga Saiyajin", sort_order: 1 },
          races: [{ slug: "saiyan", name: "Saiyajin" }],
          affiliations: [{ slug: "z-fighters", name: "Guerreiros Z" }],
          attributes: [{ slug: "fly", name: "Voo" }],
          has_transformations: true,
        },
        vegeta: {
            slug: "vegeta",
            name: "Vegeta",
            thumb_path: "/characters/vegeta-thumb.png",
            gender: { slug: "male", name: "Masculino" },
            series: { slug: "dragon-ball-z", name: "Dragon Ball Z" },
            debut_saga: { slug: "saiyan-saga", name: "Saga Saiyajin", sort_order: 1 },
            races: [{ slug: "saiyan", name: "Saiyajin" }],
            affiliations: [{ slug: "z-fighters", name: "Guerreiros Z" }],
            attributes: [{ slug: "fly", name: "Voo" }],
            has_transformations: true,
          },
      };

      const char = characters[slug || ""] || characters.goku;
      await route.fulfill({ json: [char] });
    });

    // Navigate to home first to handle locale redirection
    await page.goto("/");
    
    // Wait for the loading screen to disappear
    const loading = page.locator("#app-loading");
    await expect(loading).toHaveClass(/opacity-0/, { timeout: 30000 });

    // Navigate to Classic mode
    const classicModeLink = page.getByRole("link", { name: /Clássico|Classic/i });
    await classicModeLink.click();
    await page.waitForURL(/.*\/classic/);
  });

  test("should display the classic game interface", async ({ page }) => {
    // Check for the search input
    const searchInput = page.getByPlaceholder(/Digite o nome do personagem|Type the character name/i);
    await expect(searchInput).toBeVisible();

    // Check for the tutorial/guide accordion
    const guideHeader = page.getByText(/Precisa de um guia rápido|Need a quick guide/i);
    await expect(guideHeader).toBeVisible();
  });

  test("should search for a character and show suggestions", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Digite o nome do personagem|Type the character name/i);
    
    // Type "Goku"
    await searchInput.fill("Goku");
    
    // Wait for suggestions to appear
    const suggestionsPortal = page.locator(".z-10"); // Autocomplete.Portal
    await expect(suggestionsPortal).toBeVisible();
    
    const suggestionItem = page.getByRole("option").first();
    await expect(suggestionItem).toBeVisible();
    await expect(suggestionItem).toContainText(/Goku/i);
  });

  test("should submit a guess and display it in the table", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Digite o nome do personagem|Type the character name/i);
    
    // Type and select a character
    await searchInput.fill("Goku");
    
    // Click the first suggestion
    const firstSuggestion = page.getByRole("option").first();
    const suggestionName = await firstSuggestion.innerText();
    await firstSuggestion.click();
    
    // Check if the guessed character name is in the table
    // The GuessesTable uses motion.div for rows, we can check for an img with alt text
    const guessImage = page.locator(`img[alt="${suggestionName.trim()}"]`);
    await expect(guessImage).toBeVisible();
  });

  test("should persist guesses after page refresh", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Digite o nome do personagem|Type the character name/i);
    
    // Make a guess
    await searchInput.fill("Vegeta");
    const firstSuggestion = page.getByRole("option").first();
    const suggestionName = await firstSuggestion.innerText();
    await firstSuggestion.click();
    
    // Verify guess is there
    await expect(page.locator(`img[alt="${suggestionName.trim()}"]`)).toBeVisible();

    // Refresh page
    await page.reload();
    
    // Wait for loading screen again
    const loading = page.locator("#app-loading");
    await expect(loading).toHaveClass(/opacity-0/, { timeout: 30000 });

    // Verify guess is still there
    await expect(page.locator(`img[alt="${suggestionName.trim()}"]`)).toBeVisible();
  });
});
