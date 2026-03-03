import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import path from "path";

async function run() {
  const dbPath =
    process.env.NODE_ENV === "test"
      ? path.resolve(__dirname, "test.sqlite")
      : path.resolve(__dirname, "db.sqlite");

  const client = createClient({ url: `file:${dbPath}` });
  const db = drizzle(client);

  await migrate(db, {
    migrationsFolder: path.resolve(__dirname, "../../drizzle"),
  });
  client.close();
}

run();
