# Documentação para IA (PROMPT.md)

Este documento descreve a arquitetura, o design system, os padrões de código e as regras de negócio do projeto **DragonBallDle**. Qualquer assistente de IA que atue neste repositório deve ler e seguir estas diretrizes rigorosamente para manter a consistência do código.

## 1. Stack Tecnológica
- **Framework:** Next.js (App Router, React 19)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4
- **Internacionalização (i18n):** `next-intl`

## 2. Arquitetura e Estrutura de Pastas
- `src/app/[lang]/`: Utiliza o App Router do Next.js com suporte a múltiplos idiomas nativo nas rotas. Nenhuma página deve ser criada fora do escopo de `[lang]` a menos que seja um utilitário global/API.
- `src/components/`: Componentes de layout e de contexto inteligente (ex: `Header.tsx`, `Footer.tsx`).
- `src/components/_UI/`: Componentes visuais "dumb"/reutilizáveis. Siga o paradigma de atomic design para botões, modais, loaders (ex: `GameButton.tsx`, `SplashScreen.tsx`).
- `src/i18n/`: Configurações do `next-intl`. Contém wrappers essenciais para navegação.

## 3. Padrões de Design de UI e Design System
O projeto possui uma identidade visual fortemente inspirada em jogos (Game UI) e no universo de Dragon Ball.
As variáveis globais estão definidas via `@theme inline` no `src/app/globals.css`, eliminando a necessidade de um `tailwind.config.ts` tradicional.

### Cores e Temas
- **Primary:** `bg-primary`, `text-primary` (Laranja marcante: `--color-orange-400`).
- **Backgrounds de Destaque:** Uso de fundos escuros, imagens de background via CDN e tipografia contrastante em branco (`--color-white`).
- As telas possuem um container centralizado (`max-width: 1140px`, `padding-inline: 0.75rem`).

### Tipografia
Sempre utilize as classes do Tailwind mapeadas para as fontes do Google Fonts importadas no `layout.tsx`:
- `font-display` (Bangers): Usada para títulos principais, números grandes e textos de forte impacto visual.
- `font-base` (Roboto): Usada para o corpo do texto e leitura longa.
- `font-ui` (Inter): Usada para elementos de interface menores.

### Estilo de Componentes Interativos (Botões e Cards)
Os botões do jogo utilizam padrões recorrentes:
- **Bordas Grossas:** `border-2 border-orange-600` (quando ativos) ou `border-zinc-600` (quando inativos).
- **Arredondamento:** `rounded-2xl` para suavizar componentes grandes.
- **Transições e Efeitos Visuais:** Use `transition-all hover:scale-110 cursor-pointer` para elementos clicáveis. O feedback tátil/visual no hover é vital para a pegada de jogo.
- **Layout Interno:** Flexbox predominante (`flex items-center gap-10`), mesclando um ícone/símbolo à esquerda e textos à direita.

## 4. Regras de Código e Padrões de Desenvolvimento

1. **Estilização e Animações:**
   - **Sempre use Tailwind classes:** Evite ao máximo criar arquivos `.css` paralelos.
   - **Framer Motion:** Para animações complexas, surgimento de elementos em tela e transições (como modais, menus laterais e drawers), utilize a biblioteca `framer-motion` em vez de tentar forçar a sintaxe do Tailwind. Animações simples como de `hover:scale` continuam no Tailwind.
   - **Phosphor Icons:** Para ícones, utilize a biblioteca `@phosphor-icons/react`. Sempre utilize a propriedade `weight` para definir o estilo do ícone (ex: `weight="fill"`, `weight="light"`, `weight="regular"`, `weight="bold"`, `weight="thin"`). Sempre importe os ícone com o sufixo `Icon` (ex: `import { Gamepad as GamepadIcon } from "@phosphor-icons/react";`).

2. **Internacionalização Obrigatória:**
   **Nenhum texto deve ser hardcoded na UI.** Textos devem sempre utilizar o hook `useTranslations` (do `next-intl`).
   Exemplo correto: `<h3>{t("classic.title")}</h3>` e não `<h3>Clássico</h3>`.

3. **Navegação (Links e Routers):**
   **NUNCA utilize o `next/link` nativo ou o `next/navigation` diretamente.** Como o projeto é baseado em rotas com `[lang]`, você DEVE usar os wrappers exportados de `src/i18n/navigation.ts`.
   ```tsx
   import { Link, useRouter, usePathname } from "@/i18n/navigation";
   ```

4. **Imagens:**
   Utilize o componente `Image` de `next/image`. Defina `priority` para imagens do acima da dobra (above-the-fold). Assets estáticos locais ficam no diretório `/public/assets/`, mas imagens de background e logo geralmente usam o caminho relativo de uma CDN (ex: `process.env.NEXT_PUBLIC_CDN_BASE_URL`).

5. **Gerenciamento de Atributos Existentes:**
   Nunca remova atributos de `id` dos componentes HTML. Eles podem estar acoplados à lógica de análise ou scripts paralelos.

## 5. Fluxo de Trabalho de IA
- Ao criar um componente novo, pergunte-se: "Isso é genérico?" Se sim, deite-o em `_UI/`.
- Antes de aplicar novos estilos, verifique se não existe uma variável no `@theme inline` dentro do `globals.css` que já satisfaça a necessidade estética.
- Ao atualizar ou instanciar qualquer configuração global de CSS, tenha em mente a sintaxe v4 do TailwindCSS (`@import "tailwindcss";` / `@theme inline { ... }`).
