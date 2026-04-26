# Desenvolvimento Local com Supabase

Este guia explica como configurar e utilizar o Supabase localmente para o projeto **DragonBallDle**.

## Por que utilizar o Supabase Local?

1. **Segurança de Dados**: Testar migrações ou alterações destrutivas no banco local garante que os dados de produção permaneçam intactos.
2. **Isolamento**: Você pode resetar o banco, apagar tabelas e testar fluxos de borda sem afetar outros desenvolvedores ou usuários reais.
3. **Velocidade**: A latência de rede é eliminada, tornando as consultas e o desenvolvimento de Edge Functions muito mais rápidos.
4. **Custo**: Consultas locais não consomem a quota do plano gratuito do Supabase.

---

## Passo a Passo para Configuração

### 1. Pré-requisitos
*   **Docker Desktop**: Necessário para rodar os containers do Supabase.
*   **Supabase CLI**: Instalado via npm/pnpm.

### 2. Configuração do Ambiente (.env)
Para conectar o app ao banco local, seu `.env` deve apontar para o host do Docker. Execute `pnpm npx supabase status` para obter as chaves atuais.

Valores padrão para local:
```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sua_anon_key_local
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_local
SUPABASE_PROJECT_ID=id_do_seu_projeto_docker
```

### 3. Comandos Essenciais

*   **Iniciar o banco**:
    ```powershell
    pnpm npx supabase start
    ```
*   **Resetar o banco (Aplica migrações e seed)**:
    ```powershell
    pnpm npx supabase db reset
    ```
*   **Gerar dados iniciais (Seed)**:
    Se o seu banco local estiver vazio, você pode exportar dados de produção para o arquivo `supabase/seed.sql` e rodar o `db reset`.

---

## Resolução de Problemas Comuns

### Erro: "Invalid API key"
Este erro geralmente ocorre por dois motivos:
1. **Chave Incorreta**: Você está usando a chave do projeto remoto no host local. Use `pnpm npx supabase status -o json` para copiar a `ANON_KEY` correta.
2. **Formatação**: Certifique-se de que a chave no `.env` não possui espaços ou quebras de linha.

### Erro: "role 'looker_readonly' does not exist"
Ao fazer `db pull` de um projeto remoto, o Supabase pode trazer permissões de roles que só existem na nuvem.
*   **Solução**: Remova as linhas que mencionam `looker_readonly` ou outros roles customizados dos seus arquivos em `supabase/migrations/`.

### Erro de Sintaxe em Migrações
Se o `db reset` falhar com erro de sintaxe após uma limpeza de migração, verifique se não restaram comandos órfãos como `ON "public"."tabela"`. O arquivo de migração deve conter comandos SQL completos.

---

## Dicas de Ouro
*   **Aba Anônima**: Sempre teste alterações de autenticação em uma aba anônima para evitar caches de sessão do navegador.
*   **Logs**: Use o Dashboard local em `http://localhost:54323` para visualizar logs de banco e Edge Functions em tempo real.
