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

## Performance Tips (MAXIMUM OPTIMIZATIONS)

### Global Setup (vitest.setup.tsx) - ALWAYS APPLY

- **Aggressive Timeout Fast-Forward**: Override `setTimeout` to fast-forward common delays (2700ms, 100ms, 200ms, 300ms, 500ms → 0ms) and reduce others (>1000ms → 100ms)
- **setInterval Optimization**: Fast-forward intervals >100ms to 10ms
- **Cached Mock Functions**: Pre-create expensive mocks (router, Supabase, Audio) to avoid recreation
- **Simplified Framer Motion Mock**: Use simple div replacements instead of complex Proxy
- **Audio Mock**: Reused mock instance for all Audio references

### Vitest Configuration - ALWAYS APPLY

- **Thread Pool**: `pool: "threads"` for parallel execution
- **Reduced Isolation**: `isolate: false` for shared test environment
- **Fast Timeouts**: `testTimeout: 10000`, `hookTimeout: 5000`
- **Mock Management**: `clearMocks: true`, `restoreMocks: true`

### Unit Tests

- **Minimal Dependencies**: Import only what is strictly necessary. Avoid importing heavy React components when testing pure logic.
- **Fake Timers**: Use `vi.useFakeTimers()` to test time-dependent logic (intervals, debounces) without actual delays.
- **Fast Assertions**: Use `toHaveLength()` instead of `toBe()`, combine multiple `act()` calls

### Integration Tests (Vitest + RTL) - MAXIMUM PERFORMANCE

- **Instant User Events**: `userEvent.setup({ delay: null })` for zero-delay interactions
- **Animation Bypassing**: Mock `framer-motion` globally in `vitest.setup.tsx` to replace `motion` components with standard `div`s.
- **Delay Interception**: Override `setTimeout` in `vitest.setup.tsx` to fast-forward specific long game delays (e.g., win animations) from seconds to `0ms`.
- **Component Isolation**: Mock complex or 3rd-party components (Portals, heavy Autocompletes) with simplified inputs to focus on state and logic.
- **Audio Mocking**: Mock `Audio` and `HTMLMediaElement` globally to avoid "Not Implemented" errors in `jsdom`.
- **Balanced Timeouts**: Use 1500ms for `waitFor` and `findByText` calls - fast but reliable
- **Remove Unnecessary Hooks**: Skip `afterEach` if not needed for cleanup
- **Inline Mocks**: Use `vi.mock()` with inline functions to avoid hoisting issues
- **Dynamic Import Mocks**: Use `await import()` pattern for mock references in tests

### E2E Tests (Playwright)

- **Asset Mocking**: Intercept and fulfill PNGs/heavy assets with a 1x1 transparent pixel to reduce network I/O.
- **Third-Party & Ad Mocking**: For components that load third-party scripts or render iframes (like ads), do not test the third-party service itself. Instead, use `page.route()` to intercept the request to the service (or your proxy that calls it). Fulfill the route with a predictable mock response (e.g., a simple HTML document). Use `frameLocator` to assert that your component correctly renders the mock content within the iframe. This validates your integration without network dependency.
- **Direct Navigation**: Use direct `page.goto('/target')` instead of clicking through the Home page to save ~10-20s per test.
- **State Hydration**: For persistence tests, use `waitForFunction` or wait for specific `data-hydrated="true"` attributes to ensure state is settled.
- **Worker Count**: Use a moderate worker count (2-3) to balance speed and local machine resources.
- **Resilient Targeting**: Use `getByRole` and `getByText` with `exact: false` or regex to make tests less brittle to minor copy changes.

## Template Examples (MAXIMUM PERFORMANCE)

### Integration Test Template

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

// ALWAYS use inline mocks to avoid hoisting issues
vi.mock("@/features/game-engine/services/characters", () => ({
  getCharacterBySlug: vi.fn(),
}));

describe("Component Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle user interactions", async () => {
    // ALWAYS use instant userEvent
    const user = userEvent.setup({ delay: null });

    render(<Component />);

    const input = screen.getByPlaceholderText("Search...");

    // ALWAYS use dynamic import for mocks
    const { getCharacterBySlug } = await import("@/features/game-engine/services/characters");
    vi.mocked(getCharacterBySlug).mockResolvedValueOnce(mockData);

    await user.type(input, "test");
    await user.click(await screen.findByText("Result", {}, { timeout: 1500 }));

    // ALWAYS use balanced timeouts
    await waitFor(() => {
      expect(screen.getByTestId("result")).toHaveTextContent("Success");
    }, { timeout: 1500 });
  });
});
```

### Vitest Config Template

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.tsx"],
    include: ["src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],

    // MAXIMUM PERFORMANCE
    pool: "threads",
    testTimeout: 10000,
    hookTimeout: 5000,
    isolate: false,
    clearMocks: true,
    restoreMocks: true,
  },
});
```

### Global Setup Template (vitest.setup.tsx)

```typescript
// AGGRESSIVE TIMEOUT FAST-FORWARD
const originalSetTimeout = global.setTimeout;
vi.stubGlobal("setTimeout", (cb: TimerHandler, ms?: number) => {
  if (ms === 2700 || ms === 100 || ms === 200 || ms === 300 || ms === 500)
    return originalSetTimeout(cb, 0);
  if (ms && ms > 1000) return originalSetTimeout(cb, 100);
  return originalSetTimeout(cb, ms);
});

// CACHED MOCKS
const createMockRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
});
```
