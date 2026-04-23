# GEMINI.md — Antigravity-specific overrides
# Universal rules are in AGENTS.md. This file adds Antigravity-only behavior.

## Agent Behavior
- Always read AGENTS.md before starting any task
- Skills are in `.agents/skills/` — they load automatically by context match
- Before coding, confirm which skill was loaded: state it in one line, then proceed
- Produce Artifacts (task plan + implementation plan) for tasks spanning more than 2 files
- Prefer parallel agents for independent subtasks (e.g., UI + tests simultaneously)

## Design Standards
- Follow the Game UI identity: dark backgrounds, orange primary (`--color-orange-400`), Bangers for display text
- Container max-width: 1140px with `padding-inline: 0.75rem`
- Interactive elements: `border-2`, `rounded-2xl`, `transition-all hover:scale-110`

## Terminal Policy
- Auto-execute: `pnpm`, `git status`, `git diff`, read-only filesystem commands
- Always request review before: `git commit`, `git push`, database migrations, env changes