---
name: performance
description: Optimization of load times, bundle size, and runtime performance for DragonBallDle.
globs: "**/*.{ts,tsx}", "next.config.js", "globals.css", "src/lib/supabase.ts"
---

# Skill: Performance

1. **Next.js Rendering Strategy**:
   - **RSC by Default**: Keep logic in Server Components to reduce the JavaScript sent to the client.
   - **Streaming**: Use `Suspense` boundaries around data-heavy components (like leaderboards or character lists) to improve perceived performance.

2. **Asset Optimization (CRITICAL)**:
   - **Images**: Use `next/image` for all images. Set `priority` for LCP elements (e.g., the daily character in Silhouette mode or the header logo).
   - **Sizing**: Provide `width` and `height` to prevent Cumulative Layout Shift (CLS).
   - **CDN**: Always prefix external assets with `NEXT_PUBLIC_CDN_BASE_URL`.

3. **Database & Data Fetching**:
   - **Thin Queries**: Only `.select()` the columns you actually need. NEVER use `.select('*')` for character data.
   - **Filtering**: Perform as much filtering as possible on the Supabase side rather than in memory on the client.
   - **Caching**: Leverage Next.js `fetch` cache for Supabase queries.
     - **Time-based Revalidation**: For data that changes on a predictable schedule (like the daily character), use time-based revalidation. Wrap the Supabase server client's `fetch` to set the `revalidate` option to the number of seconds until the next update. This heavily reduces database load.
     - **Tag-based Revalidation**: For data that needs on-demand revalidation, use `revalidateTag`.

4. **Runtime & Animations**:
   - **Framer Motion**: Prefer `transform` and `opacity` animations over layout-triggering properties (width, height, top, left).
   - **Re-renders**: Ensure that context providers (like `GuessesContext`) are placed as low as possible in the tree to avoid global re-renders on every guess.
   - **Memoization**: Use `useMemo` for complex mapping logic (like `buildShareText`) and `memo` for high-frequency table rows.

5. **Bundle Management**:
   - **Dynamic Imports**: Use `next/dynamic` for components that are only shown after user interaction (e.g., `ShareDropdown`, `WinModal`, `SocialLinksModal`, `LeaderboardModal`).
     - **SSR Disabled**: For client-side interactive components, use `{ ssr: false }`.
     - **Conditional Rendering**: Combine dynamic imports with a state flag. Only render the component when its controlling state is true (e.g., a modal's `isOpen` state). This prevents the component from being rendered unnecessarily, even on the client.
   - **Tree Shaking**: Ensure imports from `@phosphor-icons/react` are specific to avoid bundling the entire icon set.

6. **CSS Performance**:
   - **Tailwind v4**: Stick to utility classes. Avoid complex CSS selectors that are slow to calculate.
   - **No Runtime Styles**: Never use CSS-in-JS libraries that calculate styles at runtime.
