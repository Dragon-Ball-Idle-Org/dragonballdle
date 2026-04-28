---
name: cost-optimization
description: Strategies to maintain free-tier hosting on Vercel/Supabase while using modern Next.js features.
globs: "next.config.ts", "src/app/**/*.tsx", "src/lib/supabase.ts", "middleware.ts"
---

# Skill: Cost Optimization

1. **Image Handling (Bypassing Vercel Limits)**:
   - **Unoptimized by Default**: Always keep `unoptimized: true` in `next.config.ts`. This bypasses Vercel's Image Optimization API, which has a very low limit (1,000 images) on the free tier.
   - **CDN First**: Offload all heavy assets to Cloudflare/R2. Ensure `NEXT_PUBLIC_CDN_BASE_URL` is used correctly.

2. **Serverless Execution Efficiency**:
   - **RSC vs. Client Components**: Favor React Server Components (RSC). They run during build or on the server, reducing the client-side bundle and preventing unnecessary client-side fetching that triggers additional serverless function calls.
   - **Selective Middleware**: Keep `middleware.ts` lean. Use `matcher` to exclude static files, images, and internal Next.js paths (`_next`) to avoid running the middleware on every single asset request.
   - **Avoid Edge Runtime**: Only use `runtime: 'edge'` if necessary for geographical latency or specific Edge features. Standard Node.js lambdas often have more predictable free-tier behavior for simple tasks.

3. **Data Fetching & Caching**:
   - **Static Generation**: Use `generateStaticParams` for routes that can be pre-rendered at build time (e.g., character info pages that don't change daily).
   - **Revalidation (ISR)**: Use `export const revalidate = 3600` (or appropriate time) to cache pages on Vercel's Edge Network, reducing hits to your Supabase database and serverless functions.
   - **Request Memoization**: Take advantage of React 19's automatic fetch memoization. Don't worry about calling the same `fetch` in multiple components within a single render pass.

4. **Database (Supabase) Cost Control**:
   - **Connection Pooling**: Use the Supabase client efficiently. Avoid creating multiple client instances.
   - **Batching**: Use `Promise.all` for parallel data fetching to reduce total execution time of serverless functions.
   - **Thin Payloads**: Use selective `.select('col1, col2')` to reduce egress data costs and memory usage.

5. **Third-Party Services**:
   - **Sentry Tunneling**: Be cautious with `tunnelRoute: "/api/sentry-tunnel"`. While it bypasses ad-blockers, it increases your server load and serverless execution time. Disable if not strictly necessary for the current phase.
   - **Analytics**: Use lightweight analytics (like Plausible or simple Google Analytics) that don't bloat the bundle or require heavy proxying.

6. **Build Performance**:
   - **Linting & Type Checking**: Ensure local builds are clean to avoid wasted build minutes on Vercel's CI/CD.
