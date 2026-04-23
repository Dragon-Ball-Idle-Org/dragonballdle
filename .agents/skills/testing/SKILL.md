---
name: testing
description: Escrever testes unitários, de integração ou E2E com Vitest e Playwright
globs: **/*.test.ts, **/*.test.tsx, **/*.spec.ts, tests/e2e/**/*.ts
---

# Skill: Testing

## Placement

| Type        | Location                                   | Command                 |
| ----------- | ------------------------------------------ | ----------------------- |
| Unit        | `**/__tests__/unit/*.test.{ts,tsx}`        | `pnpm test:unit`        |
| Integration | `**/__tests__/integration/*.test.{ts,tsx}` | `pnpm test:integration` |
| E2E         | `/tests/e2e/*.spec.ts`                     | `pnpm test:e2e`         |

## Rules

1. **Unit**: Test pure functions, utils, and hooks only — no React rendering unless necessary
2. **Integration (RTL)**: Use `getByRole` / `getByText`. Avoid `data-testid`. Use `userEvent` not `fireEvent`. Mock `next-intl` provider for i18n components
3. **Game logic**: Test that local state correctly computes wins, losses, and guess-slot filling for both Classic and Silhouette modes
4. **Mocks**: Global mocks in `vitest.setup.tsx`. Local mocks with `vi.mock()`. Always mock IndexedDB (`dexie`) and Supabase/Edge Functions in client tests
