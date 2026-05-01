# 🎨 Design System

DragonBallDle's visual identity is built on two complementary themes and a curated set of design tokens, all managed through Tailwind CSS v4's `@theme` engine.

## Design Tokens

All tokens are defined in `src/app/globals.css` using `@theme inline {}`.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--palette-orange-base` | `#fb8c00` | Primary brand color |
| `--palette-orange-light` | `#ffa726` | Hover states, accents |
| `--palette-orange-dark` | `#e65100` | Active states, emphasis |
| `--palette-green-base` | `#00b400` | Correct guess indicator |
| `--palette-green-dark` | `#228b22` | Correct (dark variant) |
| `--palette-green-light` | `#32cd32` | Correct (light variant) |
| `--pallete-radar-green` | `#338551` | Capsule Corp / radar theme |
| `--pallete-radar-yellow` | `#fbbf24` | Radar accent |
| `--pallete-blue-light` | `#00b4d8` | Capsule Corp primary |
| `--pallete-red-light` | `#ef4444` | Error, wrong guess |

### Semantic Tokens

| Token | Maps to | Usage |
|---|---|---|
| `--color-primary` | `--palette-orange-base` | Main CTA, headers |
| `--color-primary-dark` | `--palette-orange-dark` | Pressed state |
| `--color-primary-light` | `--palette-orange-light` | Hover state |
| `--color-correct-dark` | `--palette-green-dark` | Correct guess (dark) |
| `--color-correct-light` | `--palette-green-light` | Correct guess (light) |

### Typography

| Token | Font | Usage |
|---|---|---|
| `--font-base` | Roboto | Body text, general UI |
| `--font-display` | Bangers | Headers, game titles, hero text |
| `--font-ui` | Inter | UI elements, subtle labels |

### Shadows

| Token | Usage |
|---|---|
| `--shadow-game` | Main card/panel shadow with subtle inner glow |
| `.shadow-hero` | Hero section drop shadow |
| `.shadow-wins-badge` | Golden glow on win badge |

## Themes

### 🥋 Martial Arts Theme

The primary theme used for the Classic game mode and general UI. Orange-dominant with dragon texture backgrounds.

| Class | Description |
|---|---|
| `.background-dragon-texture` | Orange background with dragon SVG overlay |
| `.background-dragon-texture-gray` | Gray variant (disabled state) |
| `.border-martial-arts` | Dragon border frame (24px) |
| `.border-martial-arts-sm` | Dragon border frame (20px) |
| `.guess-input-wrapper` | Input with dragon border frame |
| `.text-hero-title` | Responsive hero title (`clamp(1.875rem, 2.4vw, 2.25rem)`) |
| `.text-hero-subtitle` | Responsive hero subtitle |

### 🔬 Capsule Corp Theme

Used for the Silhouette game mode. Green/teal with a tech-radar aesthetic inspired by Dragon Radar and Scouter devices.

| Class | Description |
|---|---|
| `.bg-capsule-corp-texture` | Green radar background (full) |
| `.bg-capsule-corp-texture-sm` | Green radar background (small) |
| `.bg-capsule-corp-texture-square` | Green radar background (square ratio) |
| `.bg-scouter-texture` | Scouter overlay texture |
| `.border-capsule-corp` | Teal glow border (1rem radius) |
| `.border-capsule-corp-sm` | Teal glow border (0.75rem radius) |
| `.border-capsule-corp-viewport` | Scouter viewport border with inner shadow |
| `.panel-capsule-corp` | Gradient panel with teal accent |
| `.text-capsule-corp-primary` | Teal text color |
| `.text-capsule-corp-bright` | Light teal text |

## Component Catalog

### UI Components (`components/ui/`)

Atomic, business-agnostic components:

| Component | Description |
|---|---|
| `Header` | App header with logo and navigation |
| `Footer` | Social links, credits, language selector |
| `Modal` | Animated overlay dialog (framer-motion) |
| `Tooltip` | Hover/tap information tooltip |
| `Countdown` | Animated countdown timer |
| `BackButton` | Locale-aware back navigation |
| `GlassAccordion` | Collapsible section with glass effect |
| `ImageWithFallback` | `next/image` wrapper with error fallback |
| `Link` | Locale-aware navigation link |
| `MainContainer` | Max-width centered container |
| `ScrambleText` | Text scramble reveal animation |
| `ShareDropdown` | Share to social media dropdown |
| `ShineGradientButton` | Premium CTA button with shine animation |
| `SplashScreen` | Initial loading animation |

### Shared Components (`components/shared/`)

Game-related reusable components:

| Component | Description |
|---|---|
| `GuessesTable` | Grid showing all guesses with color feedback |
| `WinModal` | Victory modal with stats and share options |
| `WinsBadge` | Golden badge showing total wins |
| `LeaderboardModal` | Daily leaderboard rankings |
| `GuessDistributionChart` | Bar chart of guess distribution |
| `ContactForm` | Contact/feedback form |
| `ChangelogButton` | Button to open changelog |
| `ChangelogModal` | Version history dialog |
| `ChangelogTrigger` | Auto-trigger for new version notification |
| `SocialLinksModal` | Team social links |
| `CountdownToMidnight` | Timer until next daily puzzle |

## Animation Conventions

All animations use `framer-motion` with these guidelines:

| Property | Value | Notes |
|---|---|---|
| Duration | `0.2s – 0.3s` | Never overdone |
| Easing | Spring physics preferred | `type: "spring"` |
| Stagger | `0.05s – 0.1s` between children | For list animations |

### CSS Keyframes

Two global keyframes are defined in `globals.css`:

- **`popupZoom`** — Scale-up entrance with slight Y translate (modals, toasts)
- **`focusIn`** — Scale-down with blur/brightness (silhouette reveals)

## Layout

| Property | Value |
|---|---|
| Max width | `1140px` |
| Inline padding | `0.75rem` |
| Min height | `100dvh` |
| Body centering | `margin-inline: auto` |

## Related Docs

- [Architecture](./architecture.md) — component organization
- [Contributing](./contributing.md) — styling conventions
