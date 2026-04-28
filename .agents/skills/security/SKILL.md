---
name: security
description: Security guidelines, data protection, and vulnerability prevention.
globs: "**/*.{ts,tsx}", "supabase/migrations/*.sql", ".env*", "middleware.ts"
---

# Skill: Security

1. **Environment Variables (CRITICAL)**: 
   - NEVER commit real secrets to the repository.
   - Use `.env.example` to document required variables.
   - If a secret is leaked, rotate it immediately and purge history if possible.
   - Use `process.env` for server-side and `NEXT_PUBLIC_` prefix ONLY for non-sensitive client-side variables.

2. **Supabase & Database Security**:
   - **RLS (Row Level Security)**: MUST be enabled for EVERY table. Migrations should always include `ALTER TABLE "name" ENABLE ROW LEVEL SECURITY;`.
   - **Policies**: Never use broad policies like `USING (true)` for write operations. Ensure `auth.uid()` checks are used where applicable.
   - **Service Role**: NEVER use the `service_role` key on the client-side. It bypasses RLS.

3. **Code Security**:
   - **XSS Prevention**: React handles most XSS, but avoid `dangerouslySetInnerHTML`. If mandatory, sanitize with `dompurify`.
   - **Input Validation**: Use `zod` or similar to validate all external data (API responses, form inputs, URL parameters).
   - **No Raw SQL**: Always use the Supabase client or parameterized queries to prevent SQL Injection.

4. **Authentication & Authorization**:
   - Use Middleware for route protection.
   - Prefer `supabase.auth.getUser()` over `getSession()` for server-side validation to ensure the JWT is still valid.

5. **Sensitive Data Handling**:
   - Never log sensitive information (passwords, tokens, PII).
   - Sanitize error messages sent to the client; don't reveal stack traces or DB schema details.

6. **Dependency Management**:
   - Regularly run `pnpm audit` to check for known vulnerabilities.
   - Avoid adding unnecessary large dependencies that increase the attack surface.
