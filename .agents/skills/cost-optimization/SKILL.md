---
name: cost-optimization
description: Strategies to maintain free-tier hosting on Vercel/Supabase while using modern Next.js features.
globs: "next.config.ts", "src/app/**/*.tsx", "src/lib/supabase.ts", "proxy.ts"
---

# Skill: Cost Optimization

1. **Image Handling (Bypassing Vercel Limits)**:
   - **Unoptimized by Default**: Always keep `unoptimized: true` in `next.config.ts`. This bypasses Vercel's Image Optimization API, which has a very low limit (1,000 images) on the free tier.
   - **CDN First**: Offload all heavy assets to a CDN (like Cloudflare R2). Ensure `NEXT_PUBLIC_CDN_BASE_URL` is used correctly for all assets.

2. **Data Fetching & Caching (Vercel + Supabase)**:
   - **Time-based Caching for Supabase**: For queries that update on a predictable schedule (e.g., daily content), wrap the server-side Supabase client's `fetch` call to add a `revalidate` time. This caches the database response on the Next.js server, drastically reducing hits to Supabase and Vercel function execution time.
   - **Page-level ISR**: For less frequently updated pages, use `export const revalidate = 3600` (or more) to cache the entire page on Vercel's Edge Network.
   - **Static Generation**: Use `generateStaticParams` for routes that can be pre-rendered at build time (e.g., character info pages that don't change daily).
   - **Request Memoization**: Take advantage of React's automatic fetch memoization within a single render pass to avoid redundant data requests.

3. **Serverless Execution Efficiency**:
   - **RSC First**: Favor React Server Components (RSC) to reduce client-side bundle size and prevent unnecessary client-side fetching that triggers more serverless function calls.
   - **Selective Middleware**: Keep `middleware.ts` lean. Use `matcher` to exclude static files, images, and internal Next.js paths (`_next`) to avoid running the middleware on every single asset request.
   - **Standard Runtimes**: Avoid the Edge runtime (`runtime: 'edge'`) unless you specifically need its geo-distribution features. Standard Node.js lambdas are often more cost-effective for typical tasks on the free tier.

4. **Database (Supabase) Cost Control**:
   - **RPC Functions**: For complex queries, prefer creating a `function` on Supabase. This is faster and reduces the amount of data transferred (egress).
   - **Batching**: Use `Promise.all` for parallel data fetching to reduce total execution time of serverless functions.
   - **Thin Payloads**: Always use selective `.select('col1, col2')` or RPC functions to fetch only the data you need, reducing egress costs.

5. **Bundle & Asset Management**:
   - **Dynamic Imports**: Aggressively use `next/dynamic` with `{ ssr: false }` for any component that is not critical for the initial view (modals, dropdowns, win banners, etc.).
   - **Conditional Rendering**: Combine dynamic imports with state (e.g., `isOpen && <DynamicModal />`) to ensure the component is only rendered—and its code potentially loaded—when actively used.

6. **Third-Party Services**:
   - **Disable Sentry Tunneling**: In `next.config.ts`, comment out or remove the `tunnelRoute` option in the `withSentryConfig`. Tunneling increases server load and costs. Direct reporting from the client is cheaper, though it may be blocked by some ad-blockers.
   - **Lightweight Analytics**: Choose analytics services that have a minimal impact on bundle size and don't require server-side proxying.

7. **Build Performance**:
   - **Clean Builds**: Ensure `pnpm lint` and `pnpm test` pass locally to avoid wasting build minutes on Vercel's CI/CD.
