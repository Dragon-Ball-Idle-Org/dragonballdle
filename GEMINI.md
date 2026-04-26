# GEMINI.md — Antigravity Rules (Highest Priority)
# This file is read automatically by Antigravity before every task.

## Mandatory First Steps
Before planning or coding ANYTHING:
1. Read `AGENTS.md` — global architecture and critical rules
2. Identify the task domain and read the matching skill:
   - UI/React/Tailwind/Framer Motion → `.agents/skills/ui-components/SKILL.md`
   - Animations/Framer Motion/Springs → `.agents/skills/animations/SKILL.md`
   - Supabase/DB/Edge Functions → `.agents/skills/supabase/SKILL.md`
   - Translations/next-intl → `.agents/skills/i18n/SKILL.md`
   - Tests/Vitest/Playwright → `.agents/skills/testing/SKILL.md`
   - Refactor/TypeScript/Performance → `.agents/skills/code-quality/SKILL.md`
3. Start your plan with: "📖 Loaded: AGENTS.md + [skill name]"

## Project Identity
- DragonBallDle — Next.js App Router, React 19, TypeScript strict, Tailwind v4, next-intl
- Game UI aesthetic: dark backgrounds, orange primary (`--color-orange-400`), Bangers font for display
- Container: max-width 1140px, padding-inline 0.75rem

## Non-Negotiable Rules
- NEVER use `next/link` or `next/navigation` — always use `@/i18n/navigation`
- NEVER hardcode text — always `useTranslations` or `getTranslations`
- NEVER use `any` in TypeScript
- Client translations: `getTranslationsBundle()` server-side → `<TranslationProvider>` in layout
- No new `.css` files — Tailwind only
- Never remove HTML `id` attributes

## Agent Behavior (Plan Mode)
- In the Plan phase: explicitly list which skill files you will read before coding
- In the Execute phase: confirm skill was read before writing the first line of code
- For tasks touching 2+ files: produce a task plan artifact before executing

## Terminal & Process Management (CRITICAL)
- **Auto-Execute**: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test:*`, `git status`, `git diff`, `git log`.
- **Cleanup**: You MUST terminate all background processes (like `pnpm dev`) before finishing a task. Never leave them running.
- **Port Conflicts**: If a port is blocked, use `command_status` to find the process and terminate it.

## Always Request Review
- `git commit`, `git push`
- Any Supabase migration or SQL file
- Changes to `.env*` files