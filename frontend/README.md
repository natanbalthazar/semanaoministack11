# Frontend - Be The Hero

Interface web para o projeto Be The Hero (Semana O Ministack 11). Permite cadastro de ONGs, login e gerenciamento de incidentes.

## Stack

- **Framework:** Next.js 15 (App Router)
- **React:** 19
- **TypeScript**
- **Estilização:** Tailwind CSS
- **Formulários:** react-hook-form + zod
- **HTTP:** fetch (lib/api.ts)
- **Estado:** TanStack Query (opcional)
- **Testes:** Vitest + Testing Library

## Pré-requisitos

- Node.js 20+
- Backend rodando em `http://localhost:3333` (ou `NEXT_PUBLIC_API_URL`)

## Instalação

```bash
pnpm install
# ou npm install / bun install
```

## Primeira execução

1. Crie `.env.local` com:

```
NEXT_PUBLIC_API_URL=http://localhost:3333
```

2. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

3. Acesse [http://localhost:3000](http://localhost:3000)

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm start` | Inicia o servidor (após build) |
| `pnpm test` | Executa os testes |
| `pnpm lint` | Verifica lint |

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Login |
| `/register` | Cadastro de ONG |
| `/profile` | Perfil (requer login) |
| `/incidents/new` | Novo incidente (requer login) |

## Estrutura

```
frontend/
├── app/              # App Router (páginas)
├── components/       # Componentes reutilizáveis
├── hooks/            # Hooks customizados
├── lib/              # API, auth, validações
├── public/           # Assets estáticos
└── __tests__/        # Testes
```

## Documentação das mudanças

Veja o [CHANGELOG.md](./CHANGELOG.md) para o histórico de migrações.
