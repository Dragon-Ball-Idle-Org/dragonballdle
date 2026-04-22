---
description: Regras para escrever testes unitários, de integração ou e2e
globs: **/*.test.ts, **/*.test.tsx, **/*.spec.ts, **/*.spec.tsx, cypress/**/*.ts, playwright/**/*.ts
---
# Skill: Testes Automatizados

Sempre que a tarefa for criar ou modificar testes:

1. **Testes Unitários**: Não renderize o React desnecessariamente. Teste apenas funções puras, utilitários e lógicas de hooks.
2. **Integração (React Testing Library)**:
   - Procure elementos por roles acessíveis (`getByRole`, `getByText`). Evite `data-testid` a menos que seja estritamente impossível mapear pela acessibilidade.
   - Faça mock do provedor de `next-intl` para testar componentes internacionalizados.
   - Sempre utilize as APIs modernas do React Testing Library (como `userEvent` no lugar de `fireEvent`).
3. **Específico do Projeto**: Ao testar lógica dos minigames (Silhouette, Clássico), foque em garantir que o estado local está computando corretamente vitórias, derrotas e o preenchimento exato das tentativas.
4. **Mocks Locais**: Lembre-se de mockar chamadas ao IndexedDB (`dexie`) e serviços de API (`supabase` ou Edge Functions) quando fizer testes no Client.

## Organização de Arquivos

Utilizamos o padrão de **Colocation** com separação visual por tipo de teste:

- **Unitários**: Devem ficar em `**/__tests__/unit/*.test.{ts,tsx}`.
- **Integração**: Devem ficar em `**/__tests__/integration/*.test.{ts,tsx}`.
- **E2E (End-to-End)**: Devem ficar na raiz do projeto em `/tests/e2e/*.spec.ts`. Utilizamos o **Playwright**.

### Scripts de Teste
- `pnpm test:unit`: Roda apenas testes unitários.
- `pnpm test:integration`: Roda apenas testes de integração.
- `pnpm test:e2e`: Roda os testes E2E (Playwright).
- `pnpm test:e2e:ui`: Abre a interface visual do Playwright.

### O que vai em cada lugar?
- **Unit**: Funções puras (`utils/`), hooks simples, componentes de UI puros (sem estados complexos ou contextos).
- **Integration**: Componentes que consomem contextos (ex: `GuessesContext`), hooks que interagem com cache/storage/API, fluxos de formulários.
- **E2E**: Fluxos completos de página (ex: "Usuário abre a página, faz 5 chutes, ganha o jogo e vê o modal de vitória").

