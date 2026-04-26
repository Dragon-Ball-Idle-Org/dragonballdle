---
name: ui-components
description: Criar ou modificar componentes de UI no React/Next.js com Tailwind, Framer Motion e Phosphor Icons
globs: src/components/**/*.tsx, src/app/**/*.tsx
---

# Skill: UI Components

1. **Styling**: Tailwind only. Use `cn()` from `@/utils/cn` for classNames longer than one line
2. **Accessibility**: Use `@base-ui/react` for modals, dropdowns, tooltips — never build from scratch
3. **Animations**: `framer-motion` with `duration: 0.2–0.3`. Use `<AnimatePresence>` for conditional elements. Simple hovers stay in Tailwind
4. **i18n**: Never hardcode text. Use `useTranslations` and create corresponding keys in `messages/`
5. **Server vs Client**: Default to Server Component. Add `"use client"` only when hooks or interactivity are required
6. **Icons**: `@phosphor-icons/react` with explicit `weight` prop. Import with `Icon` suffix: `import { Gamepad as GamepadIcon } from "@phosphor-icons/react"`
7. **Tailwind v4**: Use `bg-linear-*` instead of `bg-gradient-*` (e.g., `bg-linear-to-r` instead of `bg-gradient-to-r`). Use `@theme inline` syntax for custom colors
8. **Clean Code**: Prefer standard Tailwind classes over arbitrary values for default measurements (e.g., use `border` instead of `border-[1px]`, `h-px` instead of `h-[1px]`)
