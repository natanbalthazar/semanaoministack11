import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { db } from "../../src/database";
import { runMigrations } from "../../src/database/migrate";
import { incidents, ongs } from "../../src/database/schema";

// O Vitest define NODE_ENV=test, então `db` aqui aponta para src/database/test.sqlite.
describe("ONG", () => {
  // Cria as tabelas (se ainda não existirem) uma vez antes de todos os testes.
  beforeAll(runMigrations);

  // Limpa as tabelas antes de cada teste. incidents primeiro: ela referencia ongs (chave estrangeira).
  beforeEach(async () => {
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
    expect(response.body.id).toHaveLength(32);
  });

  // O id é a credencial do login: se GET /ongs o devolvesse, qualquer um logaria como qualquer ONG.
  it("lists ONGs without exposing their id", async () => {
    const ong = { name: "ONG", email: "a@b.com", whatsapp: "11987654321", city: "SP", uf: "SP" };
    await request(app).post("/ongs").send(ong);

    const response = await request(app).get("/ongs");
    expect(response.body).toEqual([ong]);
    expect(response.body[0]).not.toHaveProperty("id");
  });
});
