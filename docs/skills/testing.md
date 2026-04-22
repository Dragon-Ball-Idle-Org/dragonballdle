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
