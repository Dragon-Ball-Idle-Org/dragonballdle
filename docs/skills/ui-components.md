---
description: Regras para criar ou modificar componentes de UI no React/Next.js
globs: src/components/**/*.tsx, src/app/**/*.tsx
---
# Skill: Criação de Componentes UI

Sempre que criar ou editar um componente visual no projeto DragonBallDle:

1. **Estilização**: Utilize TailwindCSS. Garanta suporte a temas se aplicável, sem recriar CSS no formato de classes inline gigantescas caso possa usar componentes menores.
2. **Acessibilidade**: Use `@base-ui/react` para interações complexas (modals, dropdowns, tooltips) em vez de criar do zero.
3. **Animações**: Utilize `framer-motion` para transições suaves, essenciais para a "game feel" do projeto.
4. **Internacionalização (i18n)**: NUNCA crie textos hardcoded (chumbados) na interface. Use o `useTranslations` do `next-intl` e instrua a criação das chaves correspondentes nos arquivos JSON em `messages/`.
5. **Server vs Client Components**: Prefira Server Components nativamente. Adicione `"use client"` apenas se precisar usar hooks (useState, useEffect) ou necessitar de interatividade direta com o usuário.
