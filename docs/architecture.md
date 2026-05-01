# 🏗️ Architecture

DragonBallDle follows **Feature-Sliced Design (FSD)**, a methodology for organizing frontend applications into isolated, self-contained layers with strict dependency rules. See [ADR-001](./decisions/001-fsd-architecture.md) for the rationale.

## Layer Diagram

```mermaid
graph TD
    subgraph "App Layer"
        A["src/app/[lang]/"]
    end

    subgraph "Features Layer"
        B["game-engine/"]
        C["classic/"]
        D["silhouette/"]
    end

    subgraph "Components Layer"
        E["components/ui/"]
        F["components/shared/"]
    end

    subgraph "Infrastructure Layer"
        G["lib/"]
        H["i18n/"]
        I["contexts/"]
        J["utils/"]
    end

    A --> B
    A --> C
    A --> D
    A --> E
    A --> F

    C --> B
    D --> B

    B --> G
    B --> J
    C --> E
    D --> E

    E --> J
    F --> J
    G --> J

    style A fill:#e65100,color:#fff
    style B fill:#fb8c00,color:#000
    style C fill:#ffa726,color:#000
    style D fill:#ffa726,color:#000
    style E fill:#338551,color:#fff
    style F fill:#338551,color:#fff
    style G fill:#1e3a5f,color:#fff
    style H fill:#1e3a5f,color:#fff
    style I fill:#1e3a5f,color:#fff
    style J fill:#1e3a5f,color:#fff
```

## Folder Structure

```text
src/
├── app/[lang]/            # Next.js pages with dynamic locale routing
│   ├── classic/           # Classic game mode page
│   ├── silhouette/        # Silhouette game mode page
│   ├── contact-us/        # Contact form page
│   ├── legal/             # Legal/privacy page
│   ├── layout.tsx         # Root layout (fonts, providers, analytics)
│   └── page.tsx           # Home page (mode selector)
│
├── features/              # Domain-driven feature modules
│   ├── game-engine/       # Shared core game logic
│   │   ├── contexts/      # GameContext, GuessesContext
│   │   ├── hooks/         # useGameFlow, useGuesses, useCharacterCache, etc.
│   │   ├── services/      # API calls (characters, daily, wins, leaderboard)
│   │   ├── types/         # CharacterGuess, GuessStatus, GameMode
│   │   └── utils/         # Game-specific utilities
│   ├── classic/           # Classic mode UI components
│   │   └── components/
│   └── silhouette/        # Silhouette mode UI components
│       └── components/
│
├── components/            # Presentation layer (business-agnostic)
│   ├── ui/                # Atoms: Header, Footer, Modal, Tooltip, Countdown, etc.
│   ├── shared/            # Game-related reusable: WinModal, GuessesTable, WinsBadge
│   ├── desktop/           # Desktop-specific layout components
│   ├── mobile/            # Mobile-specific components (BottomNavBar)
│   └── providers/         # Client-side context providers
│
├── i18n/                  # Internationalization layer
│   ├── navigation.ts      # Wrapped Link/redirect (MUST use this, never next/link)
│   ├── routing.ts         # Locale definitions (20 languages)
│   └── request.ts         # Server-side locale resolution
│
├── contexts/              # Global React contexts
├── lib/                   # Infrastructure & configuration
│   ├── daily.ts           # Timezone-aware date logic (todayBrasiliaKey)
│   ├── feature-flags.ts   # LaunchDarkly integration
│   ├── supabase/          # Supabase client configuration
│   └── db/                # Database query utilities
│
├── utils/                 # Pure utility functions
│   ├── cn.ts              # clsx + tailwind-merge
│   ├── seed.ts            # Deterministic PRNG for daily characters
│   ├── storage.ts         # LocalStorage wrapper
│   └── time.ts            # Time formatting utilities
│
├── shared/                # Cross-cutting shared types
├── types/                 # Global TypeScript types
└── hooks/                 # Global custom hooks
```

## Dependency Rules

These rules **must** be followed to maintain architectural integrity:

```mermaid
graph LR
    A["features/classic"] --"✅ CAN import"--> B["features/game-engine"]
    A --"❌ CANNOT import"--> C["features/silhouette"]
    C --"✅ CAN import"--> B
    C --"❌ CANNOT import"--> A
    B --"✅ CAN import"--> D["lib/ · utils/"]
    A --"✅ CAN import"--> E["components/ui"]

    style A fill:#ffa726,color:#000
    style B fill:#fb8c00,color:#000
    style C fill:#ffa726,color:#000
    style D fill:#1e3a5f,color:#fff
    style E fill:#338551,color:#fff
```

| Rule | Description |
|---|---|
| Features are isolated | `classic/` and `silhouette/` **never** import from each other |
| `game-engine` is the hub | Shared hooks, types, and services live here |
| Components are agnostic | `components/ui/` should not contain game logic |
| Unidirectional flow | Lower layers never import from upper layers |

## Server vs Client Components

Next.js 16 defaults to **Server Components**. The project follows this principle:

| Pattern | When |
|---|---|
| Server Component (default) | Static content, data fetching, metadata |
| `"use client"` | Hooks (`useState`, `useEffect`), event handlers, browser APIs, animations |

**Translation pattern for client components:**

```
Server (layout.tsx)               Client Component
┌───────────────────┐            ┌──────────────────────┐
│ getTranslations() │──bundle──→ │ <TranslationProvider> │
│ or                │            │   useTranslations()   │
│ getTranslationsBundle()│       └──────────────────────┘
└───────────────────┘
```

## Request Lifecycle

```mermaid
sequenceDiagram
    participant Browser
    participant Next as Next.js (RSC)
    participant Supa as Supabase
    participant LD as LaunchDarkly
    participant CDN as Cloudflare R2

    Browser->>Next: GET /pt-BR/classic/
    Next->>Supa: Fetch daily character
    Next->>LD: Check feature flags
    Next-->>Browser: HTML (RSC payload)
    Browser->>CDN: Load character images
    Browser->>Browser: Hydrate client components
```

## Related Docs

- [Game Engine](./game-engine.md) — deep dive into hooks, services, and types
- [ADR-001: FSD Architecture](./decisions/001-fsd-architecture.md) — rationale
