---
name: security
description: Security guidelines, data protection, and vulnerability prevention.
globs:
  - "**/*.{ts,tsx}"
  - "supabase/migrations/*.sql"
  - ".env*"
  - "*proxy.ts"
  - "next.config.ts"
  - "sentry.*.config.ts"
---

# Skill: Security & Data Protection

This skill outlines the mandatory security practices for the DragonBallDle project, covering infrastructure, code, and data handling.

## 1. Threat Model & Core Principles

- **Least Privilege**: Grant only the minimum necessary permissions for any operation.
- **Defense in Depth**: Implement multiple layers of security controls.
- **Secure by Design**: Integrate security into every stage of the development lifecycle.
- **Trust No One**: Assume all inputs and external systems are potentially malicious. Validate everything.

## 2. Infrastructure & Configuration (`next.config.ts`, Vercel)

### 2.1. Security Headers

Implement robust security headers in `next.config.ts` to mitigate common web vulnerabilities.

- **Content Security Policy (CSP)**: A strict CSP is CRITICAL. It prevents XSS, clickjacking, and other injection attacks by specifying which content sources are allowed.
  - Start with a restrictive policy and incrementally allow trusted sources.
  - Use `report-uri` or `report-to` to monitor violations via Sentry.
  - **AVOID `'unsafe-inline'` and `'unsafe-eval'`.** Use hashes or nonces for scripts and styles.
- **Strict-Transport-Security (HSTS)**: Enforce HTTPS. `max-age` should be at least one year (`31536000`). Include `includeSubDomains` and `preload`.
- **X-Content-Type-Options**: Set to `nosniff` to prevent MIME-type sniffing.
- **X-Frame-Options**: Set to `DENY` or `SAMEORIGIN` to prevent clickjacking. `Content-Security-Policy: frame-ancestors` is more modern and flexible.
- **Permissions-Policy**: Disable features your app doesn't need (e.g., `microphone=(), camera=()`).

### 2.2. Environment Variables (`.env*`)

- **CRITICAL**: NEVER commit real secrets to the repository.
- Use `.env.example` to document required variables with placeholder values.
- Use Vercel's Environment Variables UI for production secrets.
- **Server-Side vs. Client-Side**:
  - Server-side only: `process.env.MY_SECRET`.
  - Client-side (public): Prefix with `NEXT_PUBLIC_`. Only for non-sensitive data (e.g., Supabase URL, feature flags). The `service_role` key must NEVER be public.

## 3. Supabase & Database (`supabase/migrations/*.sql`)

### 3.1. Row Level Security (RLS)

- **MANDATORY**: RLS MUST be enabled on EVERY table that contains user data or sensitive information.
- Migrations must explicitly include `ALTER TABLE "table_name" ENABLE ROW LEVEL SECURITY;`.
- Default-deny: If no policies match, access is denied.

### 3.2. RLS Policies

- **Specificity is Key**: Avoid broad `USING (true)` policies, especially for `INSERT`, `UPDATE`, `DELETE`.
- **Ownership & Access**: Policies should be tied to the authenticated user's ID: `auth.uid() = user_id`.
- **Complex Queries**: For policies requiring complex logic, create a `SECURITY DEFINER` function. Use with extreme caution and ensure the function itself is secure.

### 3.3. Roles & Permissions

- **NEVER use the `service_role` key on the client-side.** It bypasses all RLS policies.
- Use the `anon` key for unauthenticated users and rely on RLS to restrict their access.
- For server-to-server communication requiring elevated privileges, create a dedicated user with minimal permissions or use the `service_role` key **only** in secure backend environments (e.g., Supabase Edge Functions, Vercel Serverless Functions).

## 4. Application Code (`src/**/*.ts(x)`)

### 4.1. Input Validation

- **Always Validate**: Treat all external data as untrusted. This includes API responses, form inputs, URL parameters (`searchParams`, `params`), and even data from the database.
- **Use Zod**: Standardize on `zod` for parsing and validating data structures. If validation fails, reject the request with a clear error.

### 4.2. Cross-Site Scripting (XSS)

- **Default Prevention**: React automatically escapes content, which prevents most stored and reflected XSS.
- **`dangerouslySetInnerHTML`**: AVOID this property. If absolutely necessary (e.g., for CMS content), you MUST sanitize the HTML with a robust library like `dompurify`.

### 4.3. SQL Injection (SQLi)

- **No Raw SQL**: The Supabase client library uses parameterized queries, which prevents SQLi.
- **Edge Functions & RPC**: When writing SQL in Edge Functions or `rpc()` calls, always use parameterization. NEVER concatenate strings to build SQL queries.

### 4.4. Authentication & Authorization

- **Middleware is the Gatekeeper**: Use the project's middleware file (e.g., `src/proxy.ts`) to protect routes based on authentication status.
- **Server-Side Validation**: On the server (Server Components, API Routes, Server Actions), always re-validate the user's session using `supabase.auth.getUser()`. This checks the JWT against the Supabase server, ensuring it hasn't expired or been revoked. Do not trust a JWT received from the client without verification.

## 5. Dependency Management (`package.json`, `pnpm-lock.yaml`)

- **Regular Audits**: Run `pnpm audit` frequently to identify and patch known vulnerabilities in dependencies.
- **Automated Scanning**: Integrate automated security scanning into the CI/CD pipeline (e.g., Snyk, GitHub Dependabot).
- **Minimal Surface Area**: Only add dependencies from trusted sources and ensure they are actively maintained. Vet new dependencies before adding them.

## 6. Error Handling & Monitoring (`sentry.*.config.ts`)

- **Secure Error Messages**: Never expose sensitive information in error messages sent to the client (e.g., stack traces, database schema details, file paths).
- **Centralized Logging**: Use Sentry to log errors, monitor performance, and detect security anomalies.
- **Alerting**: Configure Sentry alerts for spikes in errors, new security issues, or CSP violations to enable rapid response.
