import { migrate } from "drizzle-orm/libsql/migrator";
import path from "path";
import { client, db } from ".";

/**
 * `pnpm db:migrate`: aplica no banco os arquivos SQL de `drizzle/` que ainda não rodaram.
 *
 * O Drizzle registra cada migration aplicada na tabela `__drizzle_migrations`, então rodar
 * de novo é seguro (não duplica nada). Mudou o `schema.ts`? Gere a migration com
 * `pnpm db:generate` e depois rode este script. NÃO edite uma migration que já foi aplicada:
 * crie uma nova.
 */
export async function runMigrations() {
  await migrate(db, { migrationsFolder: path.resolve(__dirname, "../../drizzle") });
}

// Só executa (e fecha a conexão) quando chamado direto pela linha de comando, não quando importado pelos testes.
if (require.main === module) {
  runMigrations().finally(() => client.close());
}
