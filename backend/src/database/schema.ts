import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Tabela de ONGs
export const ongs = sqliteTable("ongs", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  city: text("city").notNull(),
  uf: text("uf", { length: 2 }).notNull(),
});

// Tabela de incidentes - Criando a chave estrangeira (ong_id referencia ongs.id)
export const incidents = sqliteTable("incidents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  value: text("value").notNull(), // decimal armazenado como text no SQLite
  ongId: text("ong_id")
    .notNull()
    .references(() => ongs.id),
});

export type Ong = typeof ongs.$inferSelect;
export type NewOng = typeof ongs.$inferInsert;
export type Incident = typeof incidents.$inferSelect;
export type NewIncident = typeof incidents.$inferInsert;
