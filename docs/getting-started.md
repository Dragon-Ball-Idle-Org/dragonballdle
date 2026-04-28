# 🚀 Getting Started

This guide walks you through setting up DragonBallDle for local development from scratch.

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | 20+ | JavaScript runtime |
| [pnpm](https://pnpm.io/) | 9+ | Fast, disk-efficient package manager |
| [Docker Desktop](https://www.docker.com/) | Latest | Required only for [local Supabase](./LOCAL_SUPABASE.md) |

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Dragon-Ball-Idle-Org/dragonballdle.git
cd dragonballdle

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env.local

# 4. Start the dev server
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file at the project root with the following variables:

### Required

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_CDN_BASE_URL` | CDN base URL for character images |

### Optional

| Variable | Description | Default |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for scripts) | — |
| `LD_SDK_KEY` | LaunchDarkly SDK key (feature flags) | Falls back to defaults |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | — |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager ID | — |
| `SENTRY_DSN` | Sentry DSN for error tracking | — |

> [!WARNING]
> **Never** set environment variables at OS level (`setx`, `export`). Always use `.env.local` or `.env`. See [AGENTS.md](../AGENTS.md) rule #9.

## Seeding Daily Characters

To populate the daily character schedule in your database:

```bash
pnpm seed:daily
```

This runs `scripts/populate-daily.ts`, which uses the deterministic daily algorithm to generate character assignments. See [Game Engine → Daily Algorithm](./game-engine.md#daily-character-algorithm) for details.

## Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start dev server (runs lint first) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm seed:daily` | Populate daily characters |
| `pnpm test:unit` | Run unit tests |
| `pnpm test:integration` | Run integration tests |
| `pnpm test:e2e` | Run E2E tests (Playwright) |
| `pnpm test:e2e:ui` | Run E2E tests with Playwright UI |
| `pnpm test:e2e:report` | Show E2E test report |

## Local Supabase

For running a local Supabase instance with Docker, see the dedicated guide: [Local Supabase Setup](./LOCAL_SUPABASE.md).

## Next Steps

- [Architecture](./architecture.md) — understand how the codebase is organized
- [Contributing](./contributing.md) — learn the conventions before your first PR
