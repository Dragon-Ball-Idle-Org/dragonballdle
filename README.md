# DragonBallDle — The Ultimate Daily Guessing Game

[![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-DB_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

DragonBallDle is a high-performance, community-driven daily guessing game inspired by Wordle, set in the Dragon Ball universe. Built with **Next.js 15 (App Router)** and **React 19**, it delivers a premium, smooth, and localized experience for fans worldwide.

## ⚡ Game Modes

- **Classic Mode**: Identify the mystery character by matching attributes (Race, Gender, Affiliation, Series, etc.). Features intelligent "Partial" and "Before/After" hints.
- **Silhouette Mode**: Guess the character based on a zoom-dynamic silhouette. Features a sophisticated zoom-out mechanic powered by exponential interpolation.

## 🛠️ Tech Stack

### Frontend & Core
- **Framework**: Next.js 15 (App Router) with React 19.
- **Styling**: Tailwind CSS v4 (using the latest `@theme` engine).
- **Animations**: `framer-motion` for fluid HUD transitions and micro-interactions.
- **Icons**: `@phosphor-icons/react` for a consistent visual language.
- **i18n**: `next-intl` supporting 20+ languages with full server-side and client-side integration.

### Infrastructure & Operations
- **Backend**: Supabase (PostgreSQL, Edge Functions, SSR).
- **Monitoring**: Sentry for real-time error tracking and performance profiling.
- **Feature Management**: LaunchDarkly for controlled rollouts and dynamic flag management.
- **Assets**: Optimized image delivery via custom CDN.

## 📂 Project Structure

```text
src/
├── app/[lang]/       # Multi-language App Router pages
├── components/
│   ├── ui/           # Atomic, reusable components (Design System)
│   └── themed/       # Game-specific components (CapsuleCorp, MartialArts)
├── contexts/         # React Contexts (i18n, Game State)
├── i18n/             # next-intl configuration and navigation wrappers
├── lib/              # Shared logic and API clients (Supabase, Sentry)
└── utils/            # Helper functions (cn, formatting)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables (copy `.env.example` to `.env`)
4. Run the development server:
   ```bash
   pnpm dev
   ```

### Daily Task Automation
Seed the daily character database:
```bash
pnpm seed:daily
```

## 🧪 Testing Strategy

We maintain a high-quality codebase through a multi-layered testing approach:

- **Unit & Integration**: Powered by **Vitest** and Testing Library.
  ```bash
  pnpm test:unit
  pnpm test:integration
  ```
- **End-to-End (E2E)**: **Playwright** covering critical user flows (Navigation, Search, Win Modals).
  ```bash
  pnpm test:e2e
  ```

## 📜 Legal & License

DragonBallDle is a non-commercial, fan-made project. All Dragon Ball assets, characters, and marks are property of Akira Toriyama/Shueisha, Toei Animation.

Licensed under the [MIT License](LICENSE).
