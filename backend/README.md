# Backend - Be The Hero

API REST para o projeto Be The Hero (Semana O Ministack 11). Permite cadastro de ONGs e incidentes, com autenticação via ID da ONG.

## Stack

- **Runtime:** Node.js 20+
- **Linguagem:** TypeScript
- **Framework:** Express
- **Banco de dados:** SQLite com Drizzle ORM e @libsql/client
- **Validação:** Zod
- **Documentação:** Swagger/OpenAPI
- **Testes:** Vitest

## Pré-requisitos

- Node.js 20 ou superior
- pnpm, npm ou bun

## Instalação

```bash
pnpm install
# ou
npm install
# ou
bun install
```

## Primeira execução

1. Instale as dependências
2. Rode as migrations:

```bash
pnpm run db:migrate
```

3. Inicie o servidor:

```bash
pnpm run dev
```

4. Acesse a documentação interativa: [http://localhost:3333/api-docs](http://localhost:3333/api-docs)

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm run dev` | Inicia o servidor com hot reload |
| `pnpm run build` | Compila o TypeScript |
| `pnpm run start` | Inicia o servidor (após build) |
| `pnpm test` | Executa os testes |
| `pnpm run db:migrate` | Aplica as migrations |
| `pnpm run db:push` | Sincroniza o schema (dev) |
| `pnpm run db:generate` | Gera migrations a partir do schema |
| `pnpm run db:studio` | Abre a interface visual do banco |

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/sessions` | Login por ID da ONG |
| GET | `/ongs` | Lista todas as ONGs |
| POST | `/ongs` | Cadastra nova ONG |
| GET | `/profile` | Lista incidentes da ONG autenticada |
| GET | `/incidents` | Lista incidentes (paginação: `?page=1`) |
| POST | `/incidents` | Cria incidente |
| DELETE | `/incidents/:id` | Remove incidente |

**Autenticação:** As rotas `/profile`, `POST /incidents` e `DELETE /incidents/:id` exigem o header `Authorization` com o ID da ONG.

## Estrutura

```
backend/
├── src/
│   ├── app.ts              # Configuração do Express
│   ├── server.ts           # Entry point
│   ├── controllers/        # Handlers das rotas
│   ├── database/           # Schema e conexão Drizzle
│   ├── routes/             # Definição das rotas
│   ├── utils/              # Utilitários
│   └── validations/        # Schemas Zod e OpenAPI
├── drizzle/                # Migrations SQL
├── tests/                  # Testes unitários e de integração
└── CHANGELOG.md            # Histórico de mudanças
```

## Testes

```bash
pnpm test
```

## Documentação das mudanças

Veja o [CHANGELOG.md](./CHANGELOG.md) para o histórico de migrações e alterações na stack.
