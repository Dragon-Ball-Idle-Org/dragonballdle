---
description: Regras para consultas ao banco de dados e comunicação com Supabase
globs: src/service/**/*.ts, src/lib/supabase/**/*.ts, supabase/**/*.sql
---
# Skill: Banco de Dados e Supabase

Ao trabalhar com persistência e queries na aplicação:

1. **Tipagem**: Utilize os tipos gerados do Supabase (geralmente importados do type `Database`). Nunca use `any` ou recrie tipagens manualmente se o banco já as provê pelo tipo gerado.
2. **SSR vs CSR**: Utilize a biblioteca correta do `@supabase/ssr` (`createBrowserClient`, `createServerClient` ou `createClient` adaptado) dependendo de onde o código roda (Client Component, Server Component, ou Route Handler).
3. **Tratamento de Erros**: Sempre avalie a tupla `{ data, error }` nativa das chamadas do Supabase. Dispare os erros inesperados para monitoramento utilizando o Sentry (`Sentry.captureException(error)`).
4. **Edge Functions**: Se a lógica interagir com funções do Supabase Edge, lembre-se de validar se a invocação requer cabeçalhos de autorização do usuário ou anon key.
