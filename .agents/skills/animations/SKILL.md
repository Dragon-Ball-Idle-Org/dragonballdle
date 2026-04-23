---
name: animations
description: Diretrizes para animações profissionais e confortáveis usando Framer Motion e CSS, seguindo padrões de games e web moderna.
globs: src/components/**/*.tsx, src/app/**/*.tsx
---

# Skill: Animations

Guidelines for creating "Premium" and "Game-like" animations that feel responsive and high-quality.

## 1. Timing & Easings
- **Standard Duration**: `0.2s` for micro-interactions (hovers, clicks), `0.3s` for layout transitions.
- **Easings**: Use `circOut` for exits and `backOut` for playful "gamey" entrances.
- **Consistency**: Never exceed `0.5s` for UI elements unless it's a deliberate cinematic sequence.

## 2. Spring Physics (The "Game" Feel)
Prefer springs over durations for an organic, tactile feel:
- **Default Spring**: `type: "spring", stiffness: 300, damping: 30` (Snappy but stable).
- **Soft Spring**: `stiffness: 100, damping: 15` (Bouncy, good for rewards or notifications).
- **Heavy Spring**: `stiffness: 200, damping: 40, mass: 1.5` (Weighty feel for large modals).

## 3. Performance First
- **GPU Only**: Only animate `transform` (`x`, `y`, `scale`, `rotate`) and `opacity`.
- **Layout Animations**: Use `layout` or `layoutId` from Framer Motion sparingly to avoid heavy recalculations.
- **Will-Change**: Use CSS `will-change: transform` only for complex, high-frequency animations.

## 4. Interaction Best Practices
- **Hover**: Subtle scale (e.g., `1.02`) + brightness or shadow boost.
- **Tap/Active**: Immediate scale down (e.g., `0.95`) to simulate physical compression.
- **Focus**: Clear visual state change, ideally using the project's orange (`--color-orange-400`).

## 5. Sequences & Staggers
- **Entrance**: Use `staggerChildren: 0.05` or `0.1` for list items or grouped elements.
- **AnimatePresence**: Always use `mode="wait"` if switching between two unique components in the same spot.
- **Exit**: Exit animations should generally be faster than entrance animations.

## 6. Game UI Specials
- **Screen Shake**: Use a small, high-frequency spring on the `x` axis for errors or impacts.
- **Glow Pulse**: Use `animate={{ opacity: [0.5, 1, 0.5] }}` with `transition={{ repeat: Infinity }}` for rare items or active states.
- **Silhouette Mode**: Animations here should feel high-tech (Scouter/HUD style). Use `ScrambleText` and fast linear glides.
