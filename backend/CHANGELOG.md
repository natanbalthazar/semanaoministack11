# Changelog

## Autenticação por token e CORS restrito (2026-10)

> **BREAKING para clientes da API.** Quem chamava as rotas protegidas com o ID da ONG no header precisa fazer login e usar o token.

| | Antes | Depois |
|--|-------|--------|
| `POST /sessions` | `{ name }` | `{ name, token }` (JWT HS256, 7 dias); 429 após 10 tentativas/min por IP |
| Rotas protegidas | `Authorization: <id da ONG>` | `Authorization: Bearer <token>` (o ID cru dá 401) |
| Sem header em `/profile` / `POST /incidents` | 400 | 401 `{ message }` |
| `DELETE /incidents/:id` de outra ONG | 401 | **403** (401 só para token ausente/inválido) |
| `GET /ongs` | incluía o `id` de todas as ONGs | sem o `id` |
| ID de ONG novo | 8 hex (32 bits) | 32 hex (128 bits); os antigos continuam valendo |
| CORS | qualquer origem | só `CORS_ORIGIN` (padrão: `localhost:3000` e `localhost:8081`) |

- Novo `src/auth/` (token sem dependência nova, só `node:crypto`; middleware `ensureAuthenticated`; rate limit em memória).
- `AUTH_SECRET` obrigatório em produção (o servidor não sobe sem ele); em dev é gerado a cada start.
- `.env` carregado via `node --env-file-if-exists=.env` nos scripts `dev` e `start`; novo `.env.example`.
- Swagger: esquema `bearerAuth` (botão Authorize) nas rotas protegidas e schemas de resposta atualizados.
- Testes: token (adulterado, expirado, `alg` errado, malformado), 401 nas rotas protegidas (inclusive regressão do ID cru), 403 entre ONGs, CORS e rate limit.

## Atualização de dependências (2026-10)

### Versões

| Pacote | Antes | Depois |
|--------|-------|--------|
| express | 4.21 | **5.2** |
| zod | 3.24 | **4.6** |
| @asteasolutions/zod-to-openapi | 7.3 | **9.1** |
| drizzle-orm | 0.38 | 0.45 |
| drizzle-kit | 0.30 | 0.31 |
| @libsql/client | 0.14 | 0.18 |
| vitest | 2.1 | **5.0** |
| typescript | 5.7 | **7.0** |
| tsx | 4.19 | 4.23 |
| supertest | 7.0 | 7.3 |
| cross-env | 7.0 | removido (o Vitest já define `NODE_ENV=test`) |

Node.js mínimo passou para **22.12** (exigência do Vitest 5). `package-lock.json` removido: o projeto usa só pnpm.

### Adaptações

- **Express 5:** `req.query` virou somente leitura, então o middleware `validate()` só valida (não reescreve a requisição).
  Erros em controllers `async` agora chegam ao tratador de erros (500) em vez de derrubar o processo.
- **Zod 4:** `error.errors` → `error.issues`, `.email()` → `z.email()`, `.passthrough()` → `z.looseObject()`.
  O conteúdo de `details` nas respostas 400 mudou de formato (status e `message` continuam iguais).
- **TypeScript 7:** `moduleResolution: node` foi removido → `module: NodeNext`.

### Correções

- `pnpm start` (build) abria `dist/database/db.sqlite`, um banco vazio, e toda rota quebrava. Agora dev e build usam `src/database/db.sqlite`.
- `POST /incidents` com ID de ONG inexistente derrubava o servidor; agora responde 500.
- Testes de integração em paralelo travavam o SQLite (`SQLITE_BUSY`); agora rodam em sequência.
- `db.sqlite` e `test.sqlite` deixaram de ser versionados (já estavam no `.gitignore`).

---

## Migração Backend para TypeScript, Drizzle e Swagger

Este documento descreve as mudanças realizadas na atualização do backend da aplicação Be The Hero (Semana O Ministack 11).

## Resumo das mudanças

### Stack tecnológica

| Antes | Depois |
|-------|--------|
| JavaScript | **TypeScript** |
| Knex | **Drizzle ORM** |
| better-sqlite3 / sqlite3 | **@libsql/client** (sem binários nativos) |
| Celebrate (Joi) | **Zod** |
| Sem documentação da API | **Swagger/OpenAPI** |
| Jest | **Vitest** |
| nodemon | **tsx watch** |

> **Nota:** O driver `@libsql/client` foi adotado em substituição ao `better-sqlite3` para evitar problemas de compilação de addons nativos em diferentes versões do Node.js e ambientes (pnpm, bun, etc.).

### Novas funcionalidades

- **Documentação Swagger**: A API agora possui documentação interativa em `/api-docs`
- **Tipagem forte**: Todo o código foi migrado para TypeScript
- **Schema como código**: Drizzle usa schema TypeScript para o banco de dados

### Estrutura de arquivos

- `src/` - Código fonte TypeScript
- `src/database/schema.ts` - Schema das tabelas (ongs, incidents)
- `src/database/index.ts` - Conexão Drizzle com SQLite
- `src/validations/schemas.ts` - Schemas Zod e registro OpenAPI
- `src/validations/middleware.ts` - Middleware de validação
- `drizzle/` - Migrations geradas pelo Drizzle Kit
- `tests/` - Testes unitários e de integração com Vitest

### Rotas mantidas (mesmas funcionalidades)

- `POST /sessions` - Login por ID da ONG
- `GET /ongs` - Lista todas as ONGs
- `POST /ongs` - Cadastra nova ONG
- `GET /profile` - Lista incidentes da ONG autenticada (header authorization)
- `GET /incidents` - Lista incidentes com paginação (query page)
- `POST /incidents` - Cria incidente (header authorization)
- `DELETE /incidents/:id` - Remove incidente (valida dono via authorization)

### Correções aplicadas

- Corrigido typo: `IncedentController` → `IncidentController`
- Adicionado retorno 404 no `DELETE /incidents/:id` quando o incidente não existe
- Removidas migrations Knex duplicadas/vazias

### Scripts e primeira execução

Veja o [README.md](./README.md).

### Comentários preservados

Os comentários didáticos originais foram mantidos e adaptados ao novo contexto nos seguintes arquivos:

- `src/app.ts` - CORS e ordem dos middlewares
- `src/routes/index.ts` - Desacoplamento do Router
- `src/controllers/OngController.ts` - Desestruturação, crypto para ID, retorno do id
- `src/controllers/IncidentController.ts` - Quantidade de casos, paginação, verificação de dono
- `src/database/schema.ts` - Chave estrangeira
- `src/database/index.ts` - Uso da conexão
- `tests/unit/generateUniqueId.spec.ts` - Criação e validação do ID
- `drizzle.config.ts` - Configuração por ambiente
