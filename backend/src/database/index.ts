import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import path from "path";
import * as schema from "./schema";

/**
 * Arquivo SQLite usado pela aplicação.
 *
 * - `NODE_ENV=test` (o Vitest define sozinho) → `test.sqlite`, para os testes não sujarem seus dados.
 * - Qualquer outro caso → `db.sqlite`.
 *
 * O caminho sobe dois níveis e entra em `src/database` de propósito: assim `src/database/index.ts`
 * (pnpm dev) e `dist/database/index.js` (pnpm start) apontam para o MESMO arquivo.
 * Se usasse só `__dirname`, o build abriria `dist/database/db.sqlite`, um banco vazio
 * e sem tabelas → toda rota responderia 500 ("no such table: ongs").
 *
 * O banco não vem no repositório: rode `pnpm db:migrate` antes do primeiro `pnpm dev`.
 */
const databaseFile = path.resolve(
  __dirname,
  "../../src/database",
  process.env.NODE_ENV === "test" ? "test.sqlite" : "db.sqlite",
);

export const client = createClient({ url: `file:${databaseFile}` });

// `db` é o que os controllers usam para consultar. Passar o schema habilita as queries tipadas.
export const db = drizzle(client, { schema });
