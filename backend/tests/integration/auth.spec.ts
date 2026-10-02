import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { db } from "../../src/database";
import { runMigrations } from "../../src/database/migrate";
import { incidents, ongs } from "../../src/database/schema";

describe("Rate limit do login", () => {
  beforeAll(runMigrations);
  beforeEach(async () => {
    await db.delete(incidents);
    await db.delete(ongs);
  });

  it("responde 429 depois de 10 tentativas por minuto do mesmo IP", async () => {
    for (let i = 0; i < 10; i++) {
      expect((await request(app).post("/sessions").send({ id: `chute${i}` })).status).toBe(400);
    }
    const blocked = await request(app).post("/sessions").send({ id: "chute10" });
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers["retry-after"])).toBeGreaterThan(0);
  });
});

describe("Swagger", () => {
  it("documenta o esquema Bearer e marca as rotas protegidas", async () => {
    const res = await request(app).get("/api-docs/");
    expect(res.status).toBe(200);

    const { generateOpenAPIDocument } = await import("../../src/validations/schemas");
    const doc = generateOpenAPIDocument();
    expect(doc.components?.securitySchemes).toHaveProperty("bearerAuth");
    expect(doc.paths["/profile"].get?.security).toEqual([{ bearerAuth: [] }]);
    expect(doc.paths["/incidents"].post?.security).toEqual([{ bearerAuth: [] }]);
    expect(doc.paths["/incidents/{id}"].delete?.security).toEqual([{ bearerAuth: [] }]);
    expect(doc.paths["/incidents"].get?.security).toBeUndefined();
  });
});
