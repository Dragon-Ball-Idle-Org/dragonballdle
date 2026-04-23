---
trigger: always_on
---

# DragonBallDle — Workspace Rules

# Loaded automatically by Antigravity from .agent/rules/

## Stack

Next.js App Router · React 19 · TypeScript strict · Tailwind CSS v4 · next-intl · Supabase

## Always read before coding

- Architecture: `AGENTS.md`
- UI tasks: `.agents/skills/ui-components/SKILL.md`
- DB tasks: `.agents/skills/supabase/SKILL.md`
- i18n tasks: `.agents/skills/i18n/SKILL.md`
- Test tasks: `.agents/skills/testing/SKILL.md`
- Refactor tasks: `.agents/skills/code-quality/SKILL.md`

## Hard rules

- Navigation: `@/i18n/navigation` only — never `next/link` or `next/navigation`
- Text: `useTranslations` / `getTranslations` only — never hardcoded
- Types: no `any` ever
- Styles: Tailwind only — no new `.css` files
- Never remove `id` attributes from HTML elements
