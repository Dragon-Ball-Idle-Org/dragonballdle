import { test, expect } from "@playwright/test";

const MOCK_CHARACTER_TEMPLATE = {
  gender: { name: "Male", slug: "male" },
  races: [{ name: "Saiyan", slug: "saiyan" }],
  affiliations: [{ name: "Z Fighters", slug: "z-fighters" }],
  has_transformations: true,
  attributes: [],
  series: { name: "Dragon Ball Z", slug: "dbz" },
  debut_saga: { name: "Saiyan Saga", order: 2 },
};

const MOCK_CHARACTERS = {
  goku: {
    slug: "goku",
    name: "Goku",
    thumb_path: "/characters/goku-thumb.png",
    ...MOCK_CHARACTER_TEMPLATE,
  },
  vegeta: {
    slug: "vegeta",
    name: "Vegeta",
    thumb_path: "/characters/vegeta-thumb.png",
    ...MOCK_CHARACTER_TEMPLATE,
  },
};

/** Fulfills an OPTIONS preflight with permissive CORS headers */
async function fulfillCors(route: import("@playwright/test").Route) {
  await route.fulfill({
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, x-client-info, apikey, prefer, range",
    },
  });
}

test.describe("Classic Game Mode", () => {
  test.beforeEach(async ({ page }) => {
    /**
     * NOTE: Client-side mocks for Supabase and Search API.
     * These help make tests deterministic and work even if the backend has issues.
     * However, the server-side initial load still depends on the environment.
     */

    // ─── Mock: /api/characters/search ────────────────────────────────
    await page.route("**/api/characters/search*", async (route) => {
      if (route.request().method() === "OPTIONS")
        return fulfillCors(route);

      await route.fulfill({
        json: [
          { slug: "goku", name: "Goku", thumb_path: "/characters/goku-thumb.png" },
          { slug: "vegeta", name: "Vegeta", thumb_path: "/characters/vegeta-thumb.png" },
        ],
      });
    });

    // ─── Mock: Supabase characters table (count query used by Dexie cache) ──
    await page.route("**/rest/v1/characters*", async (route) => {
      if (route.request().method() === "OPTIONS")
        return fulfillCors(route);

      // The cache does a HEAD request with count: "exact"
      // Must handle HEAD, GET, and POST
      await route.fulfill({
        status: 200,
        headers: {
          "Content-Range": "0-1/2",
          "Content-Type": "application/json",
        },
        body: "[]",
      });
    });

    // ─── Mock: get_character_with_translations (single character fetch) ──
    await page.route(
      "**/rest/v1/rpc/get_character_with_translations*",
      async (route) => {
        const req = route.request();
        if (req.method() === "OPTIONS") return fulfillCors(route);

        let slug = "";
        if (req.method() === "GET") {
          const url = new URL(req.url());
          slug = url.searchParams.get("p_slug") || "";
        } else {
          try {
            slug = req.postDataJSON()?.p_slug || "";
          } catch {
            /* ignore */
          }
        }

        const known =
          MOCK_CHARACTERS[slug as keyof typeof MOCK_CHARACTERS];
        // For ANY unknown slug, return a synthetic character so hydration never fails
        const char = known ?? {
          ...MOCK_CHARACTER_TEMPLATE,
          slug,
          name: slug.charAt(0).toUpperCase() + slug.slice(1),
          thumb_path: `/characters/${slug}-thumb.png`,
        };

        await route.fulfill({
          status: 200,
          contentType: "application/vnd.pgrst.object+json",
          headers: {
            "Content-Range": "0-0/1",
          },
          body: JSON.stringify(char),
        });
      },
    );

    // ─── Mock: get_all_characters_with_translations (Dexie bulk fetch) ──
    await page.route(
      "**/rest/v1/rpc/get_all_characters_with_translations*",
      async (route) => {
        if (route.request().method() === "OPTIONS")
          return fulfillCors(route);

        // Return only our two controlled characters so Dexie cache is deterministic
        await route.fulfill({
          json: [MOCK_CHARACTERS.goku, MOCK_CHARACTERS.vegeta],
        });
      },
    );

    // ─── Mock: images (prevent WebKit hanging on asset loads) ──────────
    await page.route("**/*.png", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "image/png",
        body: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
          "base64",
        ),
      });
    });

    // ─── Navigate ──────────────────────────────────────────────────────
    await page.goto("/");

    // Clear IndexedDB to prevent stale Dexie cache from prior test runs
    await page.evaluate(async () => {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name) indexedDB.deleteDatabase(db.name);
      }
    });

    // Wait for the loading screen to disappear
    const loading = page.locator("#app-loading");
    await expect(loading).toHaveClass(/opacity-0/, { timeout: 30000 });

    // Navigate to Classic mode
    const classicModeLink = page.getByRole("link", {
      name: /Clássico|Classic/i,
    });
    await classicModeLink.click();
    await page.waitForURL(/.*\/classic/);
  });

  test("should display the classic game interface", async ({ page }) => {
    // Check for the search input
    const searchInput = page.getByPlaceholder(
      /Digite o nome do personagem|Type character name/i,
    );
    await expect(searchInput).toBeVisible();

    // Check for the tutorial/guide accordion
    const guideHeader = page.getByText(
      /Precisa de um guia rápido|Need a quick guide/i,
    );
    await expect(guideHeader).toBeVisible();
  });

  test("should search for a character and show suggestions", async ({
    page,
  }) => {
    const searchInput = page.getByPlaceholder(
      /Digite o nome do personagem|Type character name/i,
    );

    // Type "Goku"
    await searchInput.pressSequentially("Goku", { delay: 50 });

    // Wait for suggestions to appear
    const suggestionsPortal = page.getByRole("listbox"); // Autocomplete.Portal
    await expect(suggestionsPortal).toBeVisible();

    const suggestionItem = page.getByRole("option").first();
    await expect(suggestionItem).toBeVisible();
    await expect(suggestionItem).toContainText(/Goku/i);
  });

  test("should submit a guess and display it in the table", async ({
    page,
  }) => {
    const searchInput = page.getByPlaceholder(
      /Digite o nome do personagem|Type character name/i,
    );

    // Type and select a character
    await searchInput.pressSequentially("Goku", { delay: 50 });

    // Click the first suggestion
    const firstSuggestion = page.getByRole("option").first();
    const suggestionName = await firstSuggestion.innerText();
    await firstSuggestion.click();

    // Check if the guessed character name is in the table
    // The GuessesTable uses motion.div for rows, we can check for an img with alt text
    const guessImage = page.locator(
      `img[alt="${suggestionName.trim()}"]`,
    );
    await expect(guessImage).toBeVisible();
  });

  test("should persist guesses after page refresh", async ({ page }) => {
    // Clear any leftover state from previous tests
    await page.evaluate(() => {
      // Clear guesses from previous tests but keep other app state
      const keysToRemove = Object.keys(localStorage).filter(k => k.includes("guesses"));
      keysToRemove.forEach(k => localStorage.removeItem(k));
      const ssKeysToRemove = Object.keys(sessionStorage).filter(k => k.includes("guesses"));
      ssKeysToRemove.forEach(k => sessionStorage.removeItem(k));
    });

    const searchInput = page.getByPlaceholder(
      /Digite o nome do personagem|Type character name/i,
    );

    // Make a guess
    await searchInput.pressSequentially("Vegeta", { delay: 50 });
    const firstSuggestion = page.getByRole("option").first();
    const suggestionName = await firstSuggestion.innerText();
    await firstSuggestion.click();

    // Verify guess is there
    await expect(
      page.locator(`img[alt="${suggestionName.trim()}"]`),
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
    const loading = page.locator("#app-loading").first();
    await expect(loading).toHaveClass(/opacity-0/, { timeout: 30000 });

    // Wait for React to re-render the guesses table with hydrated data
    await expect(
      page.locator(`img[alt="${suggestionName.trim()}"]`),
    ).toBeVisible({ timeout: 30000 });
  });
});
