# 🤝 Contributing

Thank you for your interest in contributing to DragonBallDle! This guide covers the conventions, workflow, and quality standards expected for all contributions.

## Code Conventions

### TypeScript

- **Strict mode** enabled — no `any` types, ever
- Code should be **self-documenting** — add comments only when extremely necessary
- Use `type` for data shapes, `interface` for extendable contracts
- All functions should have explicit return types when non-trivial

### React / Next.js

- **Server Components by default** — add `"use client"` only when hooks or browser APIs are needed
- **Navigation:** Always import `Link` and `redirect` from `@/i18n/navigation`, never from `next/link` or `next/navigation`
- **Translations:** Never hardcode text — use `useTranslations` (client) or `getTranslations` (server)
- **Images:** Always use `next/image` with `priority` for above-the-fold content
- **IDs:** Never remove HTML `id` attributes — they may be coupled to analytics

### Styling

- **Tailwind CSS only** — no new `.css` files
- Use `cn()` from `@/utils/cn` when className spans multiple lines
- Follow the [Design System](./design-system.md) tokens and themes

### Icons

- Use `@phosphor-icons/react` exclusively
- Always specify the `weight` prop
- Import with the `Icon` suffix: `import { HouseIcon } from "@phosphor-icons/react"`

### Animations

- Use `framer-motion` for all animations
- Keep durations between `0.2s – 0.3s`
- Prefer spring physics over linear easing

## Architecture Rules

Follow [Feature-Sliced Design](./architecture.md):

1. **Features are isolated** — `classic/` and `silhouette/` never import from each other
2. **`game-engine/` is the shared hub** — all cross-mode logic lives here
3. **Components are agnostic** — `components/ui/` should not contain game logic
4. **Unidirectional flow** — lower layers never import from upper layers

## Environment Variables

> [!WARNING]
> **Never** set OS-level environment variables (e.g., `setx`, `export`). Always use `.env.local` or `.env`.

See [Getting Started](./getting-started.md#environment-variables) for the full list.

## Custom ESLint Rules

The project includes a custom ESLint rule:

| Rule | File | Description |
|---|---|---|
| `require-parse-body-for-locale` | `eslint-rules/require-parse-body-for-locale.js` | Ensures API routes parse the request body for locale extraction |

This rule only applies to files in `src/app/api/**/*.ts`.

## Branching Strategy

```
main (production)
 └── feature/<description>   # New features
 └── fix/<description>       # Bug fixes
 └── refactor/<description>  # Code improvements
```

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

feat(classic): add partial match animation
fix(i18n): correct Arabic RTL layout
refactor(game-engine): extract win logic to service
docs(readme): update architecture section
test(silhouette): add zoom-out integration test
```

### Types

| Type | Description |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change (no new feature or fix) |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `style` | Formatting, whitespace (no code change) |
| `chore` | Build process, dependencies, tooling |
| `perf` | Performance improvement |

## Pull Request Workflow

1. **Create a branch** from `main`
2. **Make changes** following the conventions above
3. **Run checks locally:**
   ```bash
   pnpm lint
   pnpm test:unit
   pnpm test:integration
   ```
4. **Open a PR** targeting `main`
5. **CI runs automatically** — lint, unit, integration, and E2E tests
6. **Code review** — at least one approval required
7. **Merge** — squash merge preferred

### PR Checklist

- [ ] No TypeScript `any` types
- [ ] No hardcoded text (all strings use `useTranslations` / `getTranslations`)
- [ ] Navigation uses `@/i18n/navigation` only
- [ ] Tests added/updated for changed logic
- [ ] All CI checks pass
- [ ] No new `.css` files (`Tailwind` only)

## Dates & Timezones

> [!CAUTION]
> **Never** use `new Date()` or manual `toISOString()` for the daily key. Always use `todayBrasiliaKey()` from `@/lib/daily`.

See [Game Engine → Timezone Awareness](./game-engine.md#timezone-awareness) for details.

## Related Docs

- [Getting Started](./getting-started.md) — development environment setup
- [Architecture](./architecture.md) — FSD structure understanding
- [Testing](./testing.md) — testing requirements and CI
