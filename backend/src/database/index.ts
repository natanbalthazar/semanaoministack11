import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import path from "path";

// Para utilizar comandos no banco: conexão Drizzle configurada por ambiente
const dbPath =
  process.env.NODE_ENV === "test"
    ? path.join(__dirname, "test.sqlite")
    : path.join(__dirname, "db.sqlite");

const client = createClient({ url: `file:${dbPath}` });
export const db = drizzle(client, { schema });
