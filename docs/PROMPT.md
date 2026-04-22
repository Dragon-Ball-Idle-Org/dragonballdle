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
- `src/components/ui/`: Componentes visuais "dumb"/reutilizáveis. Siga o paradigma de atomic design para botões, modais, loaders (ex: `GameButton.tsx`, `SplashScreen.tsx`).
- `src/i18n/`: Configurações do `next-intl`. Contém wrappers essenciais para navegação.
- `src/components/themed`: Componentes que possuem uma temática no game. (ex: `MartialArts*.tsx`, `CapsuleCorp*.tsx`)

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
   - **Framer Motion UX:** Sempre busque aprimorar a experiência do usuário (UX) utilizando a biblioteca `framer-motion` para suavizar transições de layout (como troca de abas, modais, alertas de erro/sucesso com `<AnimatePresence>`). As animações devem trazer um aspecto fluido, usando `layoutId` para elementos flutuantes ou componentes condicionais, mas evite exageros. Mantenha as durações sempre curtas (`duration: 0.2` a `0.3`) e opte pela discrição. Animações simples como `hover:scale-105` continuam no Tailwind.
   - **Phosphor Icons:** Para ícones, utilize a biblioteca `@phosphor-icons/react`. Sempre utilize a propriedade `weight` para definir o estilo do ícone (ex: `weight="fill"`, `weight="light"`, `weight="regular"`, `weight="bold"`, `weight="thin"`). Sempre importe os ícone com o sufixo `Icon` (ex: `import { Gamepad as GamepadIcon } from "@phosphor-icons/react";`).
   - **Função `cn()` para Strings de Estilo Muito Grandes:** Quando o atributo `className` ficar muito grande (mais de uma linha), importe e utilize a função `cn()` de `src/utils/cn.ts`. Esta função combina `clsx` com `twMerge` para evitar conflitos de classes Tailwind e melhorar a legibilidade do código.

     ```typescript
     import { cn } from "@/utils/cn";

     export function MyComponent() {
       return (
         <div
           className={cn(
             "flex items-center gap-4 px-6 py-3 rounded-2xl",
             "bg-orange-600 border-2 border-orange-600",
             "hover:scale-105 transition-all cursor-pointer",
             isActive && "shadow-lg shadow-orange-600/50",
           )}
         >
           Content
         </div>
       );
     }
     ```

2. **Internacionalização Obrigatória:**
   **Nenhum texto deve ser hardcoded na UI.** Textos devem sempre utilizar o hook `useTranslations` (do `next-intl`) ou `getTranslations` (do `next-intl/server`) para componentes async.
   Exemplo correto: `<h3>{t("classic.title")}</h3>` e não `<h3>Clássico</h3>`.
   **Todos os textos devem estar no arquivo de idioma correspondente em `src/i18n/messages/`** (ex: `src/i18n/messages/en-US.json`, `src/i18n/messages/pt-BR.json`, etc.) Inclusive textos de idiomas com outros caracteres, seguindo o padrão de todo o restante do arquivo de tradução, sempre traduzindo corretamente.

   **Estratégia de Carregamento de Traduções para Componentes Client-Side:**
   Para componentes client-side, **SEMPRE** carregue as traduções no servidor via `getTranslationsBundle()` e passe-as ao genérico `TranslationProvider` do projeto (localizado em `src/contexts/TranslationContext.tsx`). Isso reduz o overhead do cliente e melhora a performance ao utilizar Context API nativa.

   **Padrão de Implementação:**
   1. **No layout da página (layout.tsx - Server Component):**
      - Carregue as traduções via `getTranslationsBundle()`
      - Wrapeie os `children` com `<TranslationProvider>` passando as traduções

   2. **Nos componentes client-side:**
      - Importe o hook `useTranslations` de `src/contexts/TranslationContext.tsx`
      - Chame `useTranslations("namespace")` para acessar as traduções daquele namespace

   3. **Para dados dinâmicos (email, etc):**
      - Crie um Provider context específico conforme necessário, ou
      - Passe como props adicionais ao componente

   **Exemplo Completo:**

   ```typescript
   // src/app/[lang]/contact-us/layout.tsx (Server Component)
   import { TranslationProvider } from "@/contexts/TranslationContext";
   import { getTranslationsBundle } from "@/lib/client-translations";
   import { Header } from "@/components/ui/Header";

   export default async function ContactLayout({
     children
   }: LayoutProps<"/[lang]/contact-us">) {
     // Carrega TODAS as traduções no servidor
     const translations = await getTranslationsBundle();

     return (
       <>
         <Header />
         {/* TranslationProvider wrappeia os children - PROVIDER VAI SEMPRE NO LAYOUT! */}
         <TranslationProvider translations={translations}>
           {children}
         </TranslationProvider>
       </>
     );
   }

   // src/app/[lang]/contact-us/page.tsx (Server Component)
   import { getTranslationsBundle } from "@/lib/client-translations";
   import { ContactForm } from "@/components/shared/ContactForm";

   export default async function ContactPage() {
     const translations = await getTranslationsBundle("contact");

     return (
       <main className="w-full min-h-screen bg-black flex flex-col">
         <div className="text-center mb-12">
           <h1>{translations.contact.title}</h1>
           <p>{translations.contact.description}</p>
         </div>
         {/* ContactForm usa o TranslationProvider do layout via hook */}
         <ContactForm contactEmail={process.env.NEXT_PUBLIC_CONTACT_EMAIL!} />
       </main>
     );
   }

   // src/components/shared/ContactForm.tsx ("use client")
   "use client";
   import { useTranslations } from "@/contexts/TranslationContext";

   export function ContactForm({ contactEmail }: { contactEmail: string }) {
     // Acessa as traduções do namespace "contact" via hook
     const t = useTranslations("contact");

     return (
       <div>
         <label>{t.nameLabel}</label>
         <input placeholder={t.namePlaceholder} />
         <button>{t.sendButton}</button>
       </div>
     );
   }
   ```

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
- Utilizar comentários no código se, e somente se, for extremamente necessário.

## 7. Testes e Qualidade

Seguimos uma estratégia de testes em três níveis, com organização visual rigorosa para facilitar a manutenção:

1. **Testes Unitários**: Focam em lógica pura, utilitários e hooks isolados. Localizados em `**/__tests__/unit/*.test.{ts,tsx}`.
2. **Testes de Integração**: Validam a interação entre componentes, contextos e hooks complexos (ex: fluxos de jogo). Localizados em `**/__tests__/integration/*.test.{ts,tsx}`.
3. **Testes E2E (End-to-End)**: Validam fluxos completos do usuário no navegador (ex: Playwright/Cypress). Localizados na raiz em `/tests/e2e/*.spec.ts`.

**Regras de Ouro:**
- **Colocation**: Sempre coloque a pasta `__tests__` o mais próximo possível do código testado.
- **Mocks**: Utilize o `vitest.setup.tsx` para mocks globais e `vi.mock()` para mocks específicos de cada teste.
- **Acessibilidade**: Em testes de UI, priorize buscar elementos por Role ou Texto, refletindo a experiência do usuário real.

## 8. Skills e Guias de Ação Rápida (Para IAs)

Para instruções detalhadas de como executar tarefas específicas, você **DEVE** ler os arquivos correspondentes na pasta `docs/skills/` antes de escrever qualquer código:

- **Criação de Componentes UI**: Leia `docs/skills/ui-components.md`
- **Testes automatizados**: Leia `docs/skills/testing.md`
- **Banco de Dados (Supabase)**: Leia `docs/skills/supabase.md`
- **Internacionalização (i18n)**: Leia `docs/skills/i18n.md`
- **Qualidade de Código e Refatoração**: Leia `docs/skills/code-quality.md`

