# Frontend - Be The Hero

Interface web do Be The Hero (Semana OmniStack 11 da Rocketseat). ONGs se cadastram, fazem logon com o ID recebido e gerenciam os casos que precisam de ajuda.

## Sessão (token)

- O logon envia o ID uma única vez (`POST /sessions`) e guarda no `localStorage` o **token** devolvido (+ o nome, só para exibir). O ID não fica salvo.
- `lib/api.ts` envia `Authorization: Bearer <token>` nas chamadas com `{ auth: true }`; as páginas não montam header.
- Token expirado/inválido (a API responde 401) → a sessão é limpa e o `RequireAuth` volta para o logon com o aviso "Sua sessão expirou".
- O token dura 7 dias. Em dev, se o backend estiver sem `AUTH_SECRET`, cada restart dele invalida o token (é só logar de novo).
- O front precisa estar em uma origem liberada no `CORS_ORIGIN` do backend (padrão: `http://localhost:3000`).

## Layout responsivo

Mobile-first com os breakpoints do Tailwind: classes sem prefixo valem para o celular e as com `lg:` só a partir de 1024px, onde o layout original (desktop) é mantido igual.

- Celular: seções do `FormCard` (cadastro de ONG e de caso) empilhadas, ilustração do logon escondida, header do perfil em linhas (logo + sair / saudação / botão), casos em 1 coluna.
- `e2e/responsive.spec.ts` garante que nenhuma página tem rolagem horizontal em 320px e 390px.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **React:** 19
- **TypeScript:** 6
- **Estilização:** Tailwind CSS 4 (tema em `app/globals.css`, sem `tailwind.config`)
- **Formulários:** react-hook-form + zod 4
- **Dados da API:** fetch (`lib/api.ts`) + TanStack Query (cache, loading e erro)
- **Testes:** Vitest + Testing Library (unitários), Playwright (E2E)
- **Lint:** ESLint 9 (flat config em `eslint.config.mjs`)

## Pré-requisitos

- Node.js 24 LTS (veja `.nvmrc`; o mínimo exigido pelo Vitest/jsdom é 22.22.2)
- pnpm 10
- Backend rodando em `http://localhost:3333` (ou na URL de `NEXT_PUBLIC_API_URL`) — só para usar o app; os testes não precisam dele

## Primeira execução

```bash
nvm use            # ou: fnm use
pnpm install
cp .env.local.example .env.local
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000).

> `NEXT_PUBLIC_API_URL` é embutida no JavaScript no momento do build. Mudou a variável? Reinicie o `pnpm dev` ou rode `pnpm build` de novo.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção (não roda mais o lint) |
| `pnpm start` | Servidor de produção (depois do build) |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Checagem de tipos (`tsc --noEmit`) |
| `pnpm test` | Testes unitários (Vitest, só `__tests__/`) |
| `pnpm test:watch` | Vitest em modo watch |
| `pnpm test:e2e` | Testes E2E (Playwright, headless) |
| `pnpm test:e2e:ui` | Modo UI interativo do Playwright |
| `pnpm test:e2e:headed` | E2E com navegador visível |

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Logon |
| `/register` | Cadastro de ONG |
| `/profile` | Casos da ONG (requer logon) |
| `/incidents/new` | Novo caso (requer logon) |

## Estrutura

```
frontend/
├── app/              # App Router (páginas e layout)
├── components/       # Providers, RequireAuth, FormCard, FieldError
├── e2e/              # Testes E2E (Playwright)
├── hooks/            # useAuth
├── lib/              # api.ts, auth.ts, validations/
├── public/           # Imagens
└── __tests__/        # Testes unitários (Vitest)
```

## Testes E2E (Playwright)

Rodam no Chromium e simulam a API com `page.route`, então o backend não precisa estar rodando. O Playwright sobe o `pnpm dev` sozinho. Os mocks das rotas protegidas conferem o header `Bearer`, como o backend real.

```bash
pnpm exec playwright install chromium   # primeira vez (ou depois de atualizar o Playwright)
pnpm test:e2e
```

Se a porta 3000 já estiver ocupada por outro projeto, use outra porta, senão o Playwright reaproveita o servidor errado:

```bash
PORT=3100 pnpm test:e2e
```

## Documentação das mudanças

Veja o [CHANGELOG.md](./CHANGELOG.md).
