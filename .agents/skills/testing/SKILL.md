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

> **Agent Policy**: After writing or modifying E2E specs, the agent **does NOT need to run `pnpm test:e2e`**.
> The user will run and validate E2E tests manually. Just write the spec and commit.

## Rules

1. **Unit**: Test pure functions, utils, and hooks only — no React rendering unless necessary
2. **Integration (RTL)**: Use `getByRole` / `getByText`. Avoid `data-testid`. Use `userEvent` not `fireEvent`. Mock `next-intl` provider for i18n components
3. **Game logic**: Test that local state correctly computes wins, losses, and guess-slot filling for both Classic and Silhouette modes
4. **Mocks**: Global mocks in `vitest.setup.tsx`. Local mocks with `vi.mock()`. Always mock IndexedDB (`dexie`) and Supabase/Edge Functions in client tests
## Performance Tips

### Unit Tests
- **Minimal Dependencies**: Import only what is strictly necessary. Avoid importing heavy React components when testing pure logic.
- **Fake Timers**: Use `vi.useFakeTimers()` to test time-dependent logic (intervals, debounces) without actual delays.

### Integration Tests (Vitest + RTL)
- **Animation Bypassing**: Mock `framer-motion` globally in `vitest.setup.tsx` to replace `motion` components with standard `div`s.
- **Delay Interception**: Override `setTimeout` in `vitest.setup.tsx` to fast-forward specific long game delays (e.g., win animations) from seconds to `0ms`.
- **Component Isolation**: Mock complex or 3rd-party components (Portals, heavy Autocompletes) with simplified inputs to focus on state and logic.
- **Audio Mocking**: Mock `Audio` and `HTMLMediaElement` globally to avoid "Not Implemented" errors in `jsdom`.

### E2E Tests (Playwright)
- **Asset Mocking**: Intercept and fulfill PNGs/heavy assets with a 1x1 transparent pixel to reduce network I/O.
- **Direct Navigation**: Use direct `page.goto('/target')` instead of clicking through the Home page to save ~10-20s per test.
- **State Hydration**: For persistence tests, use `waitForFunction` or wait for specific `data-hydrated="true"` attributes to ensure state is settled.
- **Worker Count**: Use a moderate worker count (2-3) to balance speed and local machine resources.
- **Resilient Targeting**: Use `getByRole` and `getByText` with `exact: false` or regex to make tests less brittle to minor copy changes.
