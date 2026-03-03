# Changelog - Migração Frontend para Next.js 15 e Stack Moderna

Este documento descreve as mudanças realizadas na atualização do frontend da aplicação Be The Hero (Semana O Ministack 11).

## Resumo das mudanças

### Stack tecnológica

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

### Novas funcionalidades

- **Validação de formulários:** react-hook-form com schemas Zod alinhados ao backend
- **Tipagem forte:** Todo o código migrado para TypeScript
- **Estilização utilitária:** Tailwind CSS com cores customizadas
- **Testes:** Unitários para Logon e useAuth

### Estrutura de arquivos

- `app/` - Páginas com App Router (layout, page, register, profile, incidents/new)
- `components/` - Providers (QueryClient)
- `lib/` - api.ts, auth.ts, validations/schemas.ts
- `hooks/` - useAuth
- `public/` - logo.svg, heroes.png
- `__tests__/` - Logon.test.tsx, useAuth.test.ts

### Rotas mantidas

- `/` - Logon (login por ID da ONG)
- `/register` - Cadastro de ONG
- `/profile` - Perfil com casos da ONG (protegida)
- `/incidents/new` - Novo incidente (protegida)

### Proteção de rotas

- Profile e NewIncident verificam `ongId` no localStorage
- Se não autenticado, redirecionam para `/`

### Variáveis de ambiente

- `NEXT_PUBLIC_API_URL` - URL do backend (default: http://localhost:3333)

### Comentários preservados

- `app/register/page.tsx`: "Função responsável por fazer o cadastro", "Para validar se deu certo - try"
- `app/globals.css`: Reset, box-sizing
