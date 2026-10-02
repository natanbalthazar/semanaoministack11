# Changelog

## 0.5.0 - Layout responsivo

Antes: layout só para desktop; em 320px o cadastro (356px) e o perfil (405px) estouravam a tela, e em 390px o perfil também; as demais telas ficavam espremidas lado a lado.

- Mobile-first: sem prefixo = celular; `lg:` (>= 1024px) reproduz o layout antigo (diferença de 0 pixels no desktop).
- `FormCard`: seções empilhadas e padding menor no celular (vale para `/register` e `/incidents/new`).
- Logon: coluna centralizada; a ilustração só aparece a partir de `lg`.
- Perfil: header quebra em linhas com `flex-wrap` + `order-*`; botão de excluir com área de toque de 44px; textos longos quebram (`wrap-break-word`).
- `form-input` com `min-w-0` (o par Cidade/UF estourava em 320px); `back-link` com 44px de altura no celular.
- Novo e2e `responsive.spec.ts`: sem rolagem horizontal em 320px e 390px nas 4 páginas.

## 0.4.0 - Sessão por token

Acompanha a mudança do backend: as rotas protegidas exigem `Authorization: Bearer <token>`.

- Logon guarda `{ token, ongName }` (chaves `token`/`ongName` no `localStorage`); a chave antiga `ongId` é apagada ao logar/sair.
- `lib/api.ts`: opção `{ auth: true }` envia o Bearer token; 401 limpa a sessão e leva ao logon com "Sua sessão expirou".
- `useAuth` expõe `token`, `ongName` e `notice`; agora também reage a login/logout na mesma aba (evento `auth-change`).
- `RequireAuth` entrega `{ token, ongName }` (antes `{ ongId, ongName }`).
- Testes: unitários de `useAuth` e `lib/api`; mocks do Playwright com o novo contrato e e2e de token expirado.

## 0.3.0 - Next 16, Tailwind 4 e limpeza

### Dependências

| Pacote | Antes | Depois |
|--------|-------|--------|
| next | 15.5 | **16.3** |
| react / react-dom | 19.2 | 19.3 |
| tailwindcss | 3.4 | **4.3** (+ `@tailwindcss/postcss`; `autoprefixer` removido) |
| zod | 3.25 | **4.6** |
| @hookform/resolvers | 3.10 | **5.9** |
| vitest | 2.1 | **5.0** (+ `vite` 8) |
| jsdom | 25 | **30** |
| @testing-library/jest-dom | 6.9 | **7.0** |
| typescript | 5.9 | **6.0** |
| eslint / eslint-config-next | — | 9 / 16.3 |
| @playwright/test | 1.58 | 1.63 |

`pnpm audit`: 58 → 0 vulnerabilidades.

### Migrações

- `next lint` não existe mais: `pnpm lint` roda `eslint .` com `eslint.config.mjs` (flat config). O `next build` não roda lint.
- Tailwind 4: cores e fonte em `@theme` no `app/globals.css`; classes próprias com `@utility`. Inputs ganharam `bg-white` e `placeholder:text-gray-400` porque o preflight do v4 mudou esses padrões.
- `next/image`: `priority` → `preload`.
- Node mínimo: 22.22.2 (Vitest 5/jsdom 30). `.nvmrc` → 24.

### Correções e refatoração

- Fim do erro "Hydration failed" em `/profile` e `/incidents/new` (`useAuth` com `useSyncExternalStore`).
- `pnpm test` não tenta mais rodar os specs do Playwright.
- `/profile` mostra mensagem de erro quando a API falha.
- React Query usado de fato (`useQuery`/`useMutation`); `RequireAuth`, `FormCard` e `FieldError` removem duplicação.
- Acessibilidade: `aria-label` em inputs e botões de ícone; foco visível.
- Removidas as cópias não usadas em `src/assets`.

## 0.2.0 - Migração Frontend para Next.js 15 e Stack Moderna

Este documento descreve as mudanças realizadas na atualização do frontend da aplicação Be The Hero (Semana O Ministack 11).

### Resumo das mudanças

#### Stack tecnológica

| Antes | Depois |
|-------|--------|
| Create React App | **Next.js 15** (App Router) |
| React 18 | **React 19** |
| JavaScript | **TypeScript** |
| react-router-dom | **App Router** (file-based) |
| Axios | **fetch** (lib/api.ts) |
| CSS puro | **Tailwind CSS** |
| Sem validação de forms | **react-hook-form + zod** |
| Sem testes | **Vitest + Testing Library** |

#### Novas funcionalidades

- **Validação de formulários:** react-hook-form com schemas Zod alinhados ao backend
- **Tipagem forte:** Todo o código migrado para TypeScript
- **Estilização utilitária:** Tailwind CSS com cores customizadas
- **Testes:** Unitários para Logon e useAuth

#### Estrutura de arquivos

- `app/` - Páginas com App Router (layout, page, register, profile, incidents/new)
- `components/` - Providers (QueryClient)
- `lib/` - api.ts, auth.ts, validations/schemas.ts
- `hooks/` - useAuth
- `public/` - logo.svg, heroes.png
- `__tests__/` - Logon.test.tsx, useAuth.test.ts

#### Rotas mantidas

- `/` - Logon (login por ID da ONG)
- `/register` - Cadastro de ONG
- `/profile` - Perfil com casos da ONG (protegida)
- `/incidents/new` - Novo incidente (protegida)

#### Proteção de rotas

- Profile e NewIncident verificam `ongId` no localStorage
- Se não autenticado, redirecionam para `/`

#### Variáveis de ambiente

- `NEXT_PUBLIC_API_URL` - URL do backend (default: http://localhost:3333)
