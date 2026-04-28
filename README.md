# 🐉 DragonBallDle — The Ultimate Daily Dragon Ball Guessing Game! 💥

[![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-DB_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

**"Hi, I'm Goku!"** And this is **DragonBallDle**, a high-performance, community-driven daily guessing game inspired by Wordle, but with the Ki raised to the maximum! Built with the power of **Next.js 15 (App Router)** and **React 19**, it delivers a premium, blazingly fast, and localized experience for Z Fighters all around the world.

Raise your power level by trying to guess the mystery character!

## ⚡ Game Modes (The Tournament of Power)

- 🥋 **Classic Mode**: Identify the mystery character by matching their attributes (Race, Gender, Affiliation, Debut Saga, etc.). Receive intelligent hints in intense combat with a "Partial Match" system and directional arrows (Higher/Lower or Before/After).
- 👤 **Silhouette Mode**: Guess the character based on a dynamic zoomed-in silhouette! The more you miss, the more the camera zooms out, utilizing a sophisticated _zoom-out_ mechanic powered by exponential interpolation.

## 🛠️ Tech Stack (The Hyperbolic Time Chamber)

Our architecture was trained in 100x gravity to scale and withstand millions of requests, utilizing **Feature-Sliced Design (FSD)**:

### 🎨 Frontend & UI (The Project's Ki)
- **Framework**: Next.js 15 (App Router) with React 19 (Server Components by default).
- **Styling**: Tailwind CSS v4 (using the modern `@theme` engine).
- **Animations**: `framer-motion` for fluid transitions and micro-interactions that bring the interface to life, just like the Dragon Radar.
- **Icons**: `@phosphor-icons/react` providing a consistent visual language.
- **i18n**: `next-intl` bringing the DBZ universe to over 20 languages across the globe!

### ⚙️ Infrastructure & Data (The Dragon Balls)
- **Backend & DB**: Supabase (PostgreSQL for data, Edge Functions for sensitive logic).
- **Monitoring**: Sentry to intercept errors before they destroy a planet.
- **Feature Flags**: LaunchDarkly for controlled releases (Warning: Its power level is over 9000!).
- **Assets**: Optimized image delivery via CDN with `next/image`.

## 📂 Project Architecture (Feature-Sliced Design)

Structured to keep the codebase organized and ready to evolve to its final form:

```text
src/
├── app/[lang]/       # All Next.js pages, with dynamic language routing
├── features/         # Domain-driven logic (The FSD heart of the project)
│   ├── game-engine/  # Shared useGameFlow hook, core services, and global logic
│   ├── classic/      # Specific components for Classic mode
│   └── silhouette/   # Specific components for Silhouette mode
├── components/       # Business-agnostic presentation components
│   ├── ui/           # Dumb, reusable atoms (Header, Modals, Inputs, Buttons)
│   └── shared/       # Reusable game components (WinsBadge, GuessesTable)
├── contexts/         # React Global Providers (e.g., TranslationContext)
├── i18n/             # next-intl configuration and strict routing (@/i18n/navigation)
├── lib/              # Infrastructure configs (Supabase, daily dates with timezone awareness)
└── utils/            # Pure loose utility functions (cn, seed generators, storage)
```

## 🚀 How to Start Your Training

### Prerequisites
- Node.js 20+
- pnpm 9+

### Summoning Shenron (Installation)
1. Clone the repository to your machine
2. Light-speed install dependencies:
   ```bash
   pnpm install
   ```
3. Prepare your environment variables: copy `.env.example` to `.env.local`
4. Raise your Ki and start the development server:
   ```bash
   pnpm dev
   ```

### Automation (Daily Kamehameha!)
To generate daily characters via seed in your database:
```bash
pnpm seed:daily
```

## 🧪 Testing Strategy (The Gravity Machine)

We keep the code proof against Ki Blasts through systematic testing:

- **Unit & Integration Tests**: Powered by **Vitest** and Testing Library. Always colocated in the same folder as the component they test (`__tests__`).
  ```bash
  pnpm test:unit
  pnpm test:integration
  ```
- **End-to-End (E2E)**: **Playwright** covering the critical Z Fighters gameplay flows (Navigation, Search, Victory Modals).
  ```bash
  pnpm test:e2e
  ```

## 📜 Legal & License (The Galactic Patrol)

DragonBallDle is a fan-made project for fans, strictly non-commercial. All visual assets, characters, and associated marks of Dragon Ball are the intellectual property of Akira Toriyama / Shueisha and Toei Animation.

Licensed under the [MIT License](LICENSE).
