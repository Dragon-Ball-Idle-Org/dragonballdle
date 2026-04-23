---
name: supabase
description: Consultas ao banco de dados, Edge Functions e comunicação com Supabase
globs: src/service/**/*.ts, src/lib/supabase/**/*.ts, supabase/**/*.sql
---

# Skill: Supabase

1. **Typing**: Use generated types from `Database`. Never use `any` or manually recreate types
2. **SSR vs CSR**: Use the correct client from `@supabase/ssr`:
   - `createBrowserClient` → Client Component
   - `createServerClient` → Server Component / Route Handler
3. **Error handling**: Always destructure `{ data, error }`. Send unexpected errors to Sentry: `Sentry.captureException(error)`
4. **Edge Functions**: Check if invocation requires user auth headers or anon key before calling
