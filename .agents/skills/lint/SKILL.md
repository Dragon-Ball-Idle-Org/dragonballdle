---
name: lint
description: Regras de Linting, ESLint e padronização de código
globs: **/*.ts, **/*.tsx, **/*.js, **/*.mjs
---

# Skill: Lint

## Regras Críticas

1.  **Sem `any`**: O uso de `any` é estritamente proibido. Use interfaces, tipos específicos ou `unknown` se o tipo for realmente incerto.
2.  **Imagens**: Você pode usar tanto o componente `Image` do `next/image` quanto a tag HTML padrão `<img>`. A otimização automática do Next.js está desativada globalmente via `unoptimized: true` no `next.config.ts`.
3.  **API Routes (Locale)**: Em arquivos dentro de `src/app/api/**/*.ts`, você **deve** utilizar a função utilitária `parseBody(req)` em vez de `await req.json()` quando precisar extrair o campo `locale`. 
    - **Porquê**: O `parseBody` normaliza o locale para minúsculo, evitando bugs de busca no banco de dados.
    - **Erro comum**: `const { locale } = await req.json();` (ERRADO)
    - **Correto**: `const { locale } = await parseBody(req);` (CORRETO)

## Boas Práticas

4.  **Cascading Renders**: Evite atualizar o estado (`setState`) de forma síncrona dentro de um `useEffect` se isso for disparar renders desnecessários ou loops.
5.  **Configuração**: O projeto utiliza o ESLint 9+ (Flat Config) definido em `eslint.config.mjs`. 
6.  **I18n**: Lembre-se que textos visíveis ao usuário nunca devem ser hardcoded, conforme as regras de internacionalização do projeto.

## Comandos

-   Executar lint: `pnpm lint`
-   Tentar corrigir automaticamente: `pnpm lint --fix`
