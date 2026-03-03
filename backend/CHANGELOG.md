# Changelog - Migração Backend para TypeScript, Drizzle e Swagger

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

### Scripts disponíveis

```bash
npm run dev        # Desenvolvimento com hot reload
npm run build      # Compila TypeScript
npm run start      # Inicia servidor (após build)
npm test           # Executa testes
npm run db:migrate # Aplica migrations
npm run db:push    # Sincroniza schema (dev)
npm run db:studio  # Interface visual do banco
```

### Primeira execução

1. Instale as dependências: `npm install`
2. Rode as migrations: `npm run db:migrate`
3. Inicie o servidor: `npm run dev`
4. Acesse a documentação: http://localhost:3333/api-docs

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
