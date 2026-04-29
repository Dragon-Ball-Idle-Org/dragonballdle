/**
 * Paths blocked for every crawler (API, auth-ish surfaces, internal tooling).
 * AI-specific bots reuse the same policy so behaviour stays predictable.
 */
export const DISALLOW_PUBLIC_SURFACES = [
  "/api/",
  "/*/sentry-example-page/",
  "/*/sentry-example-page",
] as const;

/**
 * Major AI / LLM-related crawlers that honour robots.txt (explicit blocks avoid
 * ambiguity vs generic User-agent: *).
 *
 * Keep list maintained over time — names follow vendor docs where possible.
 *
 * @see https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers
 */
export const AI_USER_AGENTS = [
  /* OpenAI */
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  /* Anthropic */
  "Claude-Web",
  "ClaudeBot",
  "anthropic-ai",
  /* Google — AI training extension (distinct from Googlebot) */
  "Google-Extended",
  /* Apple Intelligence */
  "Applebot-Extended",
  /* Discovery / aggregators */
  "PerplexityBot",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  /* Meta — lowercase UA token per Meta crawler docs */
  "FacebookBot",
  "meta-externalagent",
] as const;
