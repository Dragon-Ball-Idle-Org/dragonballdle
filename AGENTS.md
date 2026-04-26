# AGENTS.md — DragonBallDle Project Rules

# Shared across: Antigravity, Cursor, Claude Code, Codex, Windsurf, Kiro

## Tech Stack

- Framework: Next.js (App Router, React 19)
- Language: TypeScript — strict mode, no `any`
- Styling: Tailwind CSS v4 (`@import "tailwindcss"` / `@theme inline {}` in globals.css)
- i18n: `next-intl` — no hardcoded text, ever
- Icons: `@phosphor-icons/react` with `weight` prop, imported with `Icon` suffix
- Animations: `framer-motion` — duration 0.2–0.3s, never overdone
- Utilities: `cn()` from `@/utils/cn` when className exceeds one line

## Folder Structure

- `src/app/[lang]/` — all pages live here, no exceptions
- `src/components/ui/` — dumb/reusable atoms (GameButton, SplashScreen…)
- `src/components/themed/` — game-themed components (MartialArts*, CapsuleCorp*)
- `src/i18n/` — next-intl config and navigation wrappers
- `src/contexts/` — React contexts, including TranslationContext

## Critical Rules (always enforce)

1. Navigation: NEVER use `next/link` or `next/navigation` directly. Always use `@/i18n/navigation`
2. i18n: NEVER hardcode text. Use `useTranslations` (client) or `getTranslations` (server async)
3. Client translations: load via `getTranslationsBundle()` on server → pass to `<TranslationProvider>`
4. Images: use `next/image`, set `priority` for above-the-fold. CDN via `NEXT_PUBLIC_CDN_BASE_URL`
5. Never remove HTML `id` attributes — they may be coupled to analytics or external scripts
6. Prefer Server Components. Add `"use client"` only when hooks or direct interactivity are needed
7. No parallel `.css` files — Tailwind only
8. Just write comments if extremely necessary, the code should be self-documenting.
9. Environment Variables: NEVER set OS-level environment variables (e.g., `setx`, `$env:`). Always use `.env.local` or `.env`. If a variable is accidentally set in the terminal session, remove it using `Remove-Item Env:VARIABLE_NAME` (PowerShell) or `unset VARIABLE_NAME` (Bash).
10. Dates & Timezones: NEVER use `new Date()` or manual `toISOString()` to calculate the "today" key for database queries or game logic. Always use `todayBrasiliaKey()` from `@/lib/daily` to ensure consistency with the Brasilia timezone (UTC-3).

## Testing Strategy

- Unit: `**/__tests__/unit/*.test.{ts,tsx}` → `pnpm test:unit`
- Integration: `**/__tests__/integration/*.test.{ts,tsx}` → `pnpm test:integration`
- E2E: `/tests/e2e/*.spec.ts` (Playwright) → `pnpm test:e2e`
- Colocation: `__tests__` folder as close to the tested code as possible
- Always prefer `getByRole` / `getByText` over `data-testid`

## Skill Router — read before coding

Match the task domain and read the corresponding skill file:
| Domain | Skill file |
|---|---|
| UI components, React, Tailwind, Framer Motion | `.agents/skills/ui-components/SKILL.md` |
| Animations, Framer Motion, Spring Physics | `.agents/skills/animations/SKILL.md` |
| Testing (unit, integration, E2E) | `.agents/skills/testing/SKILL.md` |
| Supabase, Edge Functions, DB queries | `.agents/skills/supabase/SKILL.md` |
| Translations, next-intl, JSON messages | `.agents/skills/i18n/SKILL.md` |
| Refactoring, TypeScript, performance | `.agents/skills/code-quality/SKILL.md` |
