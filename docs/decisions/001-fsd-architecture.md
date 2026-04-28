# ADR-001: Feature-Sliced Design Architecture

| Property | Value |
|---|---|
| **Status** | ✅ Accepted |
| **Date** | 2025 |
| **Decision makers** | Core team |

## Context

As DragonBallDle grew from a single Classic game mode to include Silhouette (and potentially more modes in the future), the codebase needed a scalable architecture that:

1. Keeps game modes **isolated** so changes in one don't break another
2. Shares common game logic (hooks, services, types) without duplication
3. Separates **presentation** from **domain logic**
4. Makes the codebase navigable for new contributors

### Alternatives Considered

| Approach | Pros | Cons |
|---|---|---|
| **Flat structure** | Simple, low ceremony | Doesn't scale; unclear boundaries |
| **Atomic Design** | Good for component libraries | Doesn't address domain logic; features mix together |
| **Barrel pattern** | Clean imports | Circular dependency risk; barrel files become bloated |
| **Feature-Sliced Design** | Domain isolation, clear layers, scales well | Learning curve; more directories |

## Decision

Adopt **Feature-Sliced Design (FSD)** as the organizational methodology, adapted for a Next.js App Router project:

```text
src/
├── app/[lang]/      → App layer (pages, routing)
├── features/        → Feature layer (domain modules)
│   ├── game-engine/ → Shared hub (hooks, services, types)
│   ├── classic/     → Classic mode (isolated)
│   └── silhouette/  → Silhouette mode (isolated)
├── components/      → UI layer (presentation only)
├── lib/             → Infrastructure layer
├── utils/           → Shared utilities
└── i18n/            → Internationalization
```

### Key Adaptations from Canonical FSD

1. **`game-engine/` as shared feature** — canonical FSD discourages cross-feature imports, but `game-engine` serves as the "shared" layer that all game modes depend on. This is a pragmatic choice: the alternative (duplicating hooks and types) would create dangerous drift.

2. **Next.js `app/` directory** — FSD's "app" layer maps naturally to Next.js App Router. Pages are thin orchestrators that compose features and components.

3. **`components/` split** — instead of a single "shared" layer, we split into `ui/` (business-agnostic atoms) and `shared/` (game-related but mode-agnostic components).

## Dependency Rules

```
app → features → components → lib/utils
         ↑ (game-engine only)
classic ──┘
silhouette ┘

classic ✗→ silhouette (NEVER)
silhouette ✗→ classic (NEVER)
```

## Consequences

### Positive

- **Isolation** — adding a new game mode means creating a new `features/<mode>/` directory without touching existing modes
- **Discoverability** — developers can find all Classic-related code in one place
- **Testability** — each feature can be tested independently with clear boundaries
- **Onboarding** — new contributors understand the project faster by following the layer structure

### Negative

- **More directories** — deeper nesting than a flat structure
- **Import discipline** — developers must know the dependency rules (enforced via code review and AGENTS.md)
- **`game-engine` coupling** — if `game-engine` grows too large, it may need to be split into sub-modules

### Mitigations

- The `AGENTS.md` file is shared across all AI coding assistants and enforces the rules automatically
- Custom ESLint rules can be added to enforce import boundaries if needed
- Regular architecture reviews to monitor `game-engine` complexity

## References

- [Feature-Sliced Design](https://feature-sliced.design/) — official documentation
- [FSD in Next.js](https://feature-sliced.design/docs/guides/tech/with-nextjs) — framework integration guide
