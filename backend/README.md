# Backend - Be The Hero

API REST do projeto Be The Hero (Semana Omnistack 11). Permite cadastro de ONGs e de casos (incidentes), com "autenticação" via ID da ONG.

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

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/sessions` | Login por ID da ONG → `{ name }` (400 se não existir) |
| GET | `/ongs` | Lista todas as ONGs |
| POST | `/ongs` | Cadastra nova ONG → `{ id }` |
| GET | `/profile` | Lista os casos da ONG autenticada |
| GET | `/incidents` | Lista casos, 5 por página (`?page=1`); total no header `X-Total-Count` |
| POST | `/incidents` | Cria caso → `{ id }` |
| DELETE | `/incidents/:id` | Remove caso (204; 401 se não for da ONG; 404 se não existir) |

**Autenticação:** `/profile`, `POST /incidents` e `DELETE /incidents/:id` usam o header `Authorization` com o ID da ONG.
Corpo, query, params ou header inválidos → 400 `{ message: "Validation failed", details: [...] }`.

> **Segurança (projeto didático):** o ID da ONG funciona como senha e `GET /ongs` lista todos os IDs.
> Ou seja, qualquer pessoa consegue agir como qualquer ONG. Numa API real, use senha + token (ex.: JWT).

## Estrutura

```
backend/
├── src/
│   ├── app.ts              # Express: CORS, JSON, rotas, Swagger e tratador de erros
│   ├── server.ts           # Entry point (sobe o servidor)
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
