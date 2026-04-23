---
name: i18n
description: Internacionalização, dicionários e tradução de textos com next-intl
globs: messages/**/*.json, src/i18n/**/*.ts
---

# Skill: i18n

1. **Tool**: `next-intl` exclusively. Message files live in `messages/`
2. **New keys**: Add to `pt-BR.json` and `en-US.json` first, then remaining locales
3. **Structure**: Group keys by page/feature context (e.g., `home`, `silhouette`, `common`, `socialLinksModal`)
4. **Interpolation**: Use `{variableName}` placeholders. Ensure TypeScript types match the variable names exactly
5. **Client components**: Load translations server-side via `getTranslationsBundle()` → pass to `<TranslationProvider>` in layout → consume with `useTranslations` from `@/contexts/TranslationContext`
