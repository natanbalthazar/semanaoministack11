import { defineConfig } from "drizzle-kit";
import path from "path";

/**
 * Configuração do drizzle-kit (CLI): `pnpm db:generate`, `db:push` e `db:studio`.
 * Usa os mesmos arquivos SQLite de src/database/index.ts (test.sqlite com NODE_ENV=test,
 * db.sqlite no resto). Se mudar o caminho lá, mude aqui também.
 */
const dbPath = path.resolve(
  __dirname,
  "src/database",
  process.env.NODE_ENV === "test" ? "test.sqlite" : "db.sqlite",
);

export default defineConfig({
  schema: "./src/database/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: `file:${dbPath}`,
  },
});
