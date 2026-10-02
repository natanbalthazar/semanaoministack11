# Backend - Be The Hero

API REST do projeto Be The Hero (Semana Omnistack 11). Permite cadastro de ONGs e de casos (incidentes), com login pelo ID da ONG e token (JWT) nas rotas protegidas.

## Stack

- **Runtime:** Node.js 22.12+ (veja `.nvmrc`)
- **Linguagem:** TypeScript 7
- **Framework:** Express 5
- **Banco de dados:** SQLite com Drizzle ORM e `@libsql/client`
- **Validação:** Zod 4
- **Documentação:** Swagger/OpenAPI (`@asteasolutions/zod-to-openapi`)
- **Testes:** Vitest 5 + Supertest

## Pré-requisitos

- Node.js 22.12 ou superior (`nvm use` lê o `.nvmrc`). O Vitest 5 não roda em versões anteriores.
- [pnpm](https://pnpm.io) 10 (o lockfile do projeto é o `pnpm-lock.yaml`)

## Primeira execução

```bash
pnpm install
pnpm db:migrate   # cria src/database/db.sqlite com as tabelas
pnpm dev          # http://localhost:3333
```

Documentação interativa: [http://localhost:3333/api-docs](http://localhost:3333/api-docs)

> O banco SQLite **não** vem no repositório. Se você pular o `pnpm db:migrate`, o servidor sobe,
> mas toda rota responde 500 (`no such table: ongs`).

Para usar outra porta: `PORT=3399 pnpm dev`.

## Variáveis de ambiente

Copie `.env.example` para `.env` (que não vai para o git). `pnpm dev` e `pnpm start` carregam o `.env`
sozinhos com a flag nativa do Node `--env-file-if-exists` (sem dotenv). Variáveis já definidas no shell têm prioridade.

| Variável | Padrão | Para que serve |
|----------|--------|----------------|
| `AUTH_SECRET` | aleatório a cada start (só fora de produção) | Segredo que assina os tokens. **Obrigatório com `NODE_ENV=production`** (mínimo 32 caracteres): sem ele o servidor não sobe. Em dev, sem ele, todo restart invalida os tokens (o front volta para o logon). |
| `PORT` | `3333` | Porta da API |
| `CORS_ORIGIN` | `http://localhost:3000,http://localhost:8081` | Origens (sites) que o navegador pode usar para chamar a API, separadas por vírgula |

Gerar um `AUTH_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia o servidor com hot reload (tsx watch) |
| `pnpm build` | Compila o TypeScript para `dist/` |
| `pnpm start` | Inicia o servidor compilado (rode `pnpm build` antes) |
| `pnpm test` | Executa os testes (usa `src/database/test.sqlite`, criado automaticamente) |
| `pnpm test:watch` | Testes em modo watch |
| `pnpm db:migrate` | Aplica as migrations de `drizzle/` no banco |
| `pnpm db:generate` | Gera uma migration a partir das mudanças em `src/database/schema.ts` |
| `pnpm db:push` | Sincroniza o schema direto no banco, sem migration (só para experimentar) |
| `pnpm db:studio` | Abre a interface visual do banco |

## API

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/sessions` | — | Login por ID da ONG → `{ name, token }` (400 se não existir; 429 após 10 tentativas/min por IP) |
| GET | `/ongs` | — | Lista as ONGs (nome, email, WhatsApp, cidade, UF — **sem o `id`**) |
| POST | `/ongs` | — | Cadastra nova ONG → `{ id }` (32 caracteres hex; guarde, é o seu login) |
| GET | `/profile` | Bearer | Lista os casos da ONG do token |
| GET | `/incidents` | — | Lista casos, 5 por página (`?page=1`); total no header `X-Total-Count` |
| POST | `/incidents` | Bearer | Cria caso para a ONG do token → `{ id }` |
| DELETE | `/incidents/:id` | Bearer | Remove caso (204; 403 se for de outra ONG; 404 se não existir) |

Corpo, query ou params inválidos → 400 `{ message: "Validation failed", details: [...] }`.

## Autenticação

1. A ONG se cadastra (`POST /ongs`) e recebe seu `id`.
2. Faz login com ele (`POST /sessions { id }`) e recebe um `token` (JWT HS256, válido por **7 dias**).
3. Nas rotas com "Bearer" envia `Authorization: Bearer <token>`. Sem token, token alterado ou expirado → 401 `{ message }`.

O token é gerado em `src/auth/token.ts` só com `node:crypto` (código comentado para estudo) e conferido pelo
middleware `ensureAuthenticated` (`src/auth/middleware.ts`), que entrega o ID da ONG ao controller em `response.locals.ongId`.
No Swagger (`/api-docs`), clique em **Authorize** e cole o token.

> O formato antigo (`Authorization: <id da ONG>`) **não funciona mais**: o ID só vale no login.
> O payload do token é só base64 (qualquer um lê): nunca coloque segredos nele.

**Limites conhecidos (projeto didático):**
- O login continua sendo só o ID da ONG (como no curso): quem tiver o ID entra. Numa API real, use senha (com hash) ou login por e-mail.
- O token não pode ser revogado antes de expirar (não há lista de sessões). Trocar o `AUTH_SECRET` invalida **todos** os tokens.
- O rate limit do login é em memória e por processo: com várias instâncias, cada uma conta separado.
- IDs antigos de 8 caracteres continuam valendo (são mais fáceis de adivinhar; o rate limit ajuda).

## CORS

Só as origens de `CORS_ORIGIN` recebem `Access-Control-Allow-Origin`; o navegador bloqueia as demais.
Requisições sem `Origin` (curl, app nativo, servidor) funcionam normalmente. CORS protege o **usuário do navegador**,
não a API: quem protege os dados é o token.

## Estrutura

```
backend/
├── src/
│   ├── app.ts              # Express: CORS, JSON, rotas, Swagger e tratador de erros
│   ├── server.ts           # Entry point (sobe o servidor)
│   ├── auth/               # Token JWT (node:crypto), middleware de autenticação e rate limit
│   ├── controllers/        # Handlers das rotas
│   ├── database/           # Schema, conexão Drizzle e script de migration
│   ├── routes/             # Definição das rotas + validação
│   ├── utils/              # Utilitários
│   └── validations/        # Schemas Zod (validação + OpenAPI) e middleware
├── drizzle/                # Migrations SQL
├── tests/                  # Testes unitários e de integração
└── CHANGELOG.md            # Histórico de mudanças
```

## Documentação das mudanças

Veja o [CHANGELOG.md](./CHANGELOG.md) para o histórico de migrações e alterações na stack.
