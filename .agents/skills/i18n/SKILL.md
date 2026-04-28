---
name: i18n
description: Internacionalização, dicionários e tradução de textos com next-intl
globs: messages/**/*.json, src/i18n/**/*.ts
---

# Skill: i18n

1. **Tool**: `next-intl` exclusively. Message files live in `messages/`
2. **New keys (MANDATORY & CRITICAL)**: You MUST update ALL locale files in `messages/` every time you add or modify a key. Never update only a few files.
   - **Checklist**: Before finishing any task involving translations, verify that the new keys exist in ALL files in the `messages/` directory.
   - **Full Translation**: You MUST translate the content into the target language. English fallbacks in non-English files are strictly forbidden.
   - **Consistency**: Use the exact same key name and hierarchy across all files.
   - **Scripting**: For large updates, write a script to ensure no file is missed.
   - **Failure Consequence**: Updating only PT-BR and EN-US is a violation of project rules and results in broken UI for other users.
3. **Structure**: Group keys by page/feature context (e.g., `home`, `silhouette`, `common`, `socialLinksModal`)
4. **Interpolation**: Use `{variableName}` placeholders. Ensure TypeScript types match the variable names exactly
5. **Client components**: Load translations server-side via `getTranslationsBundle()` → pass to `<TranslationProvider>` in layout → consume with `useTranslations` from `@/contexts/TranslationContext`
