---
name: code-quality
description: Code review, refatoração e otimização de código TypeScript/React
globs: src/**/*.ts, src/**/*.tsx
---

# Skill: Code Quality

1. **Complexity**: Split large components into smaller, focused subcomponents
2. **Types**: Remove all `any`. Enforce strict interfaces. Unify types if prop-drilling exists
3. **Performance**:
   - Check `useEffect` / `useMemo` / `useCallback` for missing or excessive dependencies
   - Use memoization only where render cost justifies it
4. **Side-effect isolation**: Centralize analytics, Sentry, and LaunchDarkly calls — keep them out of the main component body
5. **Import order**: Framework → External libs → Local absolute (`@/`) → Types → Styles
