import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import request from "supertest";
import path from "path";
import app from "../../src/app";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { incidents, ongs } from "../../src/database/schema";

const testDbPath = path.resolve(__dirname, "../../src/database/test.sqlite");
const client = createClient({ url: `file:${testDbPath}` });
const db = drizzle(client);

describe("ONG", () => {
  beforeAll(async () => {
    // Rodar migrations uma vez antes de todos os testes
    await migrate(db, {
      migrationsFolder: path.resolve(__dirname, "../../drizzle"),
    });
  });

  beforeEach(async () => {
    // Limpar tabelas antes de cada teste
    await db.delete(incidents);
    await db.delete(ongs);
  });

  it("should be able to create a new ONG", async () => {
    const response = await request(app).post("/ongs").send({
      name: "ONG do Bem2",
      email: "contato@teste.com",
      whatsapp: "11987654321",
      city: "São Paulo",
      uf: "SP",
    });

    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toHaveLength(8);
  });
});
