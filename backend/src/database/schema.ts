import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/*
 * Schema = fonte da verdade das tabelas. Alterou algo aqui? Rode `pnpm db:generate` (cria o SQL em
 * drizzle/) e `pnpm db:migrate` (aplica no banco). Só editar este arquivo NÃO muda o banco:
 * as queries passam no TypeScript e falham em runtime ("no such column").
 */

// Tabela de ONGs
export const ongs = sqliteTable("ongs", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  city: text("city").notNull(),
  uf: text("uf", { length: 2 }).notNull(),
});

// Tabela de incidentes - Criando a chave estrangeira (ong_id referencia ongs.id).
// O banco recusa um incidente cujo ong_id não existe em ongs.
export const incidents = sqliteTable("incidents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  value: text("value").notNull(), // decimal armazenado como text no SQLite
  ongId: text("ong_id")
    .notNull()
    .references(() => ongs.id),
});
