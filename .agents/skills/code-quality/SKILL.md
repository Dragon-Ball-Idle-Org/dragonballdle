---
name: code-quality
description: Code review, refatoração, linting e padronização TypeScript/React
globs: src/**/*.ts, src/**/*.tsx, scripts/**/*.ts
---

# Skill: Code Quality & Lint

## 1. Tipagem Estrita (Strict Types)

-   **Sem `any`**: O uso de `any` é estritamente proibido. Use interfaces, tipos específicos ou `unknown`.
-   **Traduções**: Para objetos de tradução dinâmicos, utilize o tipo `TranslationNamespace` (um tipo recursivo `@/lib/client-translations`) em vez de `any`.
-   **Casts**: Evite `as any`. Se precisar de flexibilidade em objetos de terceiros, use `as Record<string, unknown>`.

## 2. Padrões React e Performance

-   **Cascading Renders**: Evite atualizar o estado (`setState`) de forma síncrona dentro de um `useEffect` se isso disparar renders desnecessários ou loops.
-   **Hooks**: Sempre verifique as dependências em `useEffect`, `useMemo` e `useCallback` (exhaustive-deps).
-   **Imagens**: Use `next/image` ou `<img>`. A otimização automática está desativada (`unoptimized: true`).
-   **Componentes**: Divida componentes grandes em subcomponentes focados e menores.

## 3. Backend e API Routes

-   **Locale Normalization**: Em `src/app/api/**/*.ts`, use `parseBody(req)` em vez de `await req.json()` para extrair o `locale`. O `parseBody` normaliza o valor para minúsculo.

## 4. Estrutura e Organização

-   **Side-effect isolation**: Centralize chamadas de analytics ou libs externas fora do corpo principal do componente.
-   **Import order**: Framework → External libs → Local absolute (`@/`) → Types → Styles.

## 5. Comandos

-   Executar lint: `pnpm lint`
-   Auto-fix: `pnpm lint --fix`
-   Testes unitários: `pnpm test:unit`
