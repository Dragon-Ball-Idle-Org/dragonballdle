---
description: Foco em code review, refatoração e otimização de código
globs: src/**/*.ts, src/**/*.tsx
---
# Skill: Qualidade de Código e Refatoração

Sempre que instruído a realizar code review, avaliar qualidade de código ou refatorar:

1. **Complexidade**: Analise se componentes gigantes podem ser extraídos para subcomponentes menores, mais limpos e reutilizáveis.
2. **Tipagem e Segurança**: Procure e remova o uso de `any`. Exija interfaces e tipagens estritas, preferencialmente unificadas se houver prop-drilling.
3. **Otimizações (Performance)**: 
   - Verifique dependências ausentes ou excessivas em arrays de `useEffect`, `useMemo` e `useCallback`.
   - Analise se o componente causará re-renderizações desnecessárias. Use memoização onde justificado pelo peso da renderização.
4. **Tratamento de Dependências**: Centralize chamadas de analytics, Sentry e LaunchDarkly para não poluir o arquivo principal com lógicas secundárias pesadas.
5. **Organização de Arquivo**: Mantenha imports organizados (Framework -> Bibliotecas externas -> Componentes locais absolutos `@/` -> Tipos -> Estilos/Arquivos).
