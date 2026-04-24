import { test as base, expect, type Page, type Route } from "@playwright/test";

// ─── Mock Data ──────────────────────────────────────────────────────────────

export const MOCK_CHARACTER_TEMPLATE = {
  gender: { name: "Male", slug: "male" },
  races: [{ name: "Saiyan", slug: "saiyan" }],
  affiliations: [{ name: "Z Fighters", slug: "z-fighters" }],
  has_transformations: true,
  attributes: [],
  series: { name: "Dragon Ball Z", slug: "dbz" },
  debut_saga: { name: "Saiyan Saga", order: 2 },
};

export const MOCK_CHARACTERS = {
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

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Fulfills an OPTIONS preflight with permissive CORS headers */
export async function fulfillCors(route: Route) {
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

// ─── Route Mocking ──────────────────────────────────────────────────────────

/** Applies all Supabase & asset route mocks to the given page */
async function applyMocks(page: Page) {
  // Mock: /api/characters/search
  await page.route("**/api/characters/search*", async (route) => {
    if (route.request().method() === "OPTIONS") return fulfillCors(route);
    await route.fulfill({
      json: [
        { slug: "goku", name: "Goku", thumb_path: "/characters/goku-thumb.png" },
        { slug: "vegeta", name: "Vegeta", thumb_path: "/characters/vegeta-thumb.png" },
      ],
    });
  });

  // Mock: Supabase characters table (count query used by Dexie cache)
  await page.route("**/rest/v1/characters*", async (route) => {
    if (route.request().method() === "OPTIONS") return fulfillCors(route);
    await route.fulfill({
      status: 200,
      headers: {
        "Content-Range": "0-1/2",
        "Content-Type": "application/json",
      },
      body: "[]",
    });
  });

  // Mock: get_character_with_translations (single character fetch)
  await page.route(
    "**/rest/v1/rpc/get_character_with_translations*",
    async (route) => {
      const req = route.request();
      if (req.method() === "OPTIONS") return fulfillCors(route);

      let slug = "";
      if (req.method() === "GET") {
        slug = new URL(req.url()).searchParams.get("p_slug") || "";
      } else {
        try {
          slug = req.postDataJSON()?.p_slug || "";
        } catch {
          /* ignore */
        }
      }

      const known = MOCK_CHARACTERS[slug as keyof typeof MOCK_CHARACTERS];
      const char = known ?? {
        ...MOCK_CHARACTER_TEMPLATE,
        slug,
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        thumb_path: `/characters/${slug}-thumb.png`,
      };

      await route.fulfill({
        status: 200,
        contentType: "application/vnd.pgrst.object+json",
        headers: { "Content-Range": "0-0/1" },
        body: JSON.stringify(char),
      });
    },
  );

  // Mock: get_daily_character_with_translations
  await page.route(
    "**/rest/v1/rpc/get_daily_character_with_translations*",
    async (route) => {
      if (route.request().method() === "OPTIONS") return fulfillCors(route);
      await route.fulfill({
        status: 200,
        contentType: "application/vnd.pgrst.object+json",
        body: JSON.stringify(MOCK_CHARACTERS.goku),
      });
    },
  );

  // Mock: get_yesterday_character_with_translations
  await page.route(
    "**/rest/v1/rpc/get_yesterday_character_with_translations*",
    async (route) => {
      if (route.request().method() === "OPTIONS") return fulfillCors(route);
      await route.fulfill({
        status: 200,
        contentType: "application/vnd.pgrst.object+json",
        body: JSON.stringify(MOCK_CHARACTERS.vegeta),
      });
    },
  );

  // Mock: get_all_characters_with_translations (Dexie bulk fetch)
  await page.route(
    "**/rest/v1/rpc/get_all_characters_with_translations*",
    async (route) => {
      if (route.request().method() === "OPTIONS") return fulfillCors(route);
      await route.fulfill({
        json: [MOCK_CHARACTERS.goku, MOCK_CHARACTERS.vegeta],
      });
    },
  );

  // Mock: Images — return a 1x1 transparent pixel to prevent asset-loading delays
  await page.route("**/*.{png,jpg,jpeg,svg,webp}", async (route) => {
    const url = route.request().url();
    if (url.endsWith(".svg")) {
      await route.fulfill({
        status: 200,
        contentType: "image/svg+xml",
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>',
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: "image/png",
        body: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
          "base64",
        ),
      });
    }
  });
}

// ─── Shared Navigation ─────────────────────────────────────────────────────

/** Clears IndexedDB and waits for splash screen to dismiss */
async function preparePage(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState("domcontentloaded");

  // Clear IndexedDB
  await page.evaluate(async () => {
    const dbs = await indexedDB.databases();
    for (const db of dbs) {
      if (db.name) indexedDB.deleteDatabase(db.name);
    }
  });

  // Wait for the loading screen to disappear
  const loading = page.locator("#app-loading").first();
  await expect(loading).toHaveClass(/opacity-0/, { timeout: 30000 });
}

// ─── Custom Fixtures ────────────────────────────────────────────────────────

type Fixtures = {
  /** A page with all Supabase/asset mocks applied, landed on the home page */
  homePage: Page;
  /** A page with all mocks applied, landed on /classic */
  classicPage: Page;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await applyMocks(page);
    await preparePage(page, "/");
    await use(page);
  },

  classicPage: async ({ page }, use) => {
    await applyMocks(page);
    await preparePage(page, "/classic");
    await use(page);
  },
});

export { expect };
