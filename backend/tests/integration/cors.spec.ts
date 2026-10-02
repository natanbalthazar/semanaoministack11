import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { runMigrations } from "../../src/database/migrate";

describe("CORS", () => {
  beforeAll(runMigrations);

  it("libera as origens padrão (Next dev e Expo web) e expõe X-Total-Count", async () => {
    for (const origin of ["http://localhost:3000", "http://localhost:8081"]) {
      const res = await request(app).get("/incidents?page=1").set("Origin", origin);
      expect(res.status).toBe(200);
      expect(res.headers["access-control-allow-origin"]).toBe(origin);
      // O navegador só deixa o JS ler X-Total-Count se o CORS expuser o header (app web/Expo web).
      expect(res.headers["access-control-expose-headers"]).toBe("X-Total-Count");
      expect(res.headers["x-total-count"]).toBeDefined();
    }
  });

  it("não libera origem fora da lista (o navegador bloqueia a leitura)", async () => {
    const res = await request(app).get("/incidents").set("Origin", "https://site-malicioso.com");
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();

    const preflight = await request(app)
      .options("/incidents")
      .set("Origin", "https://site-malicioso.com")
      .set("Access-Control-Request-Method", "POST");
    expect(preflight.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("requisição sem Origin (curl, app nativo) funciona normalmente", async () => {
    const res = await request(app).get("/incidents");
    expect(res.status).toBe(200);
    expect(res.headers["x-total-count"]).toBeDefined();
  });
});
