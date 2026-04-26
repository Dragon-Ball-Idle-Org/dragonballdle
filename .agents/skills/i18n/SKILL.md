---
name: i18n
description: Internacionalização, dicionários e tradução de textos com next-intl
globs: messages/**/*.json, src/i18n/**/*.ts
---

# Skill: i18n

1. **Tool**: `next-intl` exclusively. Message files live in `messages/`
2. **New keys (CRITICAL)**: You MUST update ALL 20+ locale files in `messages/` simultaneously. Never leave a file behind.
   - Start with `pt-BR.json` and `en-US.json`.
   - Immediately update ALL other locales (ja-JP, ko-KR, ar-SA, etc.).
   - **No English Fallbacks**: You MUST translate the content into the target language. Using English text in a non-English file (e.g., Japanese text in `ja-JP.json`) is mandatory.
   - Use a script (Node.js/Python) if adding many keys to ensure consistency.
   - Partial updates or English-only updates are UNACCEPTABLE.
3. **Structure**: Group keys by page/feature context (e.g., `home`, `silhouette`, `common`, `socialLinksModal`)
4. **Interpolation**: Use `{variableName}` placeholders. Ensure TypeScript types match the variable names exactly
5. **Client components**: Load translations server-side via `getTranslationsBundle()` → pass to `<TranslationProvider>` in layout → consume with `useTranslations` from `@/contexts/TranslationContext`
