import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { signToken } from "../../src/auth/token";
import { db } from "../../src/database";
import { runMigrations } from "../../src/database/migrate";
import { incidents, ongs } from "../../src/database/schema";

const ong = {
  name: "APAD",
  email: "contato@apad.com",
  whatsapp: "11987654321",
  city: "Rio do Sul",
  uf: "SC",
};

const bearer = (token: string) => `Bearer ${token}`;

// Cobre o contrato que o frontend e o mobile usam: status, header X-Total-Count e formato das respostas.
describe("Incidents", () => {
  let ongId: string;
  let token: string;

  beforeAll(runMigrations);

  beforeEach(async () => {
    await db.delete(incidents);
    await db.delete(ongs);
    ongId = (await request(app).post("/ongs").send(ong)).body.id;
    // Assina direto (em vez de POST /sessions) para não gastar o rate limit do login.
    token = signToken(ongId);
  });

  const createIncident = (title: string, authorization = bearer(token)) =>
    request(app)
      .post("/incidents")
      .set("Authorization", authorization)
      .send({ title, description: "d", value: 120 });

  it("logs in with an existing ONG id (returns name + token) and rejects an unknown one", async () => {
    const ok = await request(app).post("/sessions").send({ id: ongId });
    expect(ok.status).toBe(200);
    expect(ok.body).toEqual({ name: ong.name, token: expect.any(String) });

    // O token devolvido no login funciona nas rotas protegidas.
    const profile = await request(app).get("/profile").set("Authorization", bearer(ok.body.token));
    expect(profile.status).toBe(200);

    const unknown = await request(app).post("/sessions").send({ id: "naoexiste" });
    expect(unknown.status).toBe(400);
    expect(unknown.body).toEqual({ erro: "No ONG found with this ID" });
  });

  it("paginates 5 per page, newest first, with X-Total-Count (public route, no token)", async () => {
    for (let i = 1; i <= 6; i++) await createIncident(`Caso ${i}`);

    const page1 = await request(app).get("/incidents");
    expect(page1.headers["x-total-count"]).toBe("6");
    expect(page1.body).toHaveLength(5);
    expect(page1.body[0]).toMatchObject({ title: "Caso 6", value: "120", ong_id: ongId, ...ong });

    const page2 = await request(app).get("/incidents?page=2");
    expect(page2.body.map((i: { title: string }) => i.title)).toEqual(["Caso 1"]);
  });

  it("lists only the authenticated ONG incidents in /profile", async () => {
    await createIncident("Caso 1");
    const other = signToken((await request(app).post("/ongs").send(ong)).body.id);

    const profile = await request(app).get("/profile").set("Authorization", bearer(token));
    expect(profile.body).toEqual([expect.objectContaining({ title: "Caso 1", ongId })]);

    const otherProfile = await request(app).get("/profile").set("Authorization", bearer(other));
    expect(otherProfile.body).toEqual([]);
  });

  it("only lets the owner ONG delete an incident", async () => {
    const { id } = (await createIncident("Caso 1")).body;
    const other = signToken((await request(app).post("/ongs").send(ong)).body.id);

    // Token válido, mas o caso é de outra ONG → 403 (não 401: a sessão está ok).
    expect((await request(app).delete(`/incidents/${id}`).set("Authorization", bearer(other))).status).toBe(403);
    expect((await request(app).delete(`/incidents/${id}`)).status).toBe(401);
    expect((await request(app).delete(`/incidents/${id}`).set("Authorization", bearer(token))).status).toBe(204);
    expect((await request(app).delete(`/incidents/${id}`).set("Authorization", bearer(token))).status).toBe(404);
  });

  it("returns 401 on protected routes without a valid token", async () => {
    const { id } = (await createIncident("Caso 1")).body;
    const expired = signToken(ongId, Date.now() - 8 * 24 * 3600 * 1000);
    const [h, , s] = token.split(".");
    const forged = `${h}.${Buffer.from(JSON.stringify({ sub: ongId, iat: 0, exp: 9_999_999_999 })).toString("base64url")}.${s}`;

    const cases: Record<string, string | undefined> = {
      "sem header": undefined,
      // Regressão da vulnerabilidade: o ID cru da ONG no header NÃO autentica mais.
      "ID cru (formato antigo)": ongId,
      "Bearer com o ID cru": bearer(ongId),
      "token inválido": bearer("abc.def.ghi"),
      "token expirado": bearer(expired),
      "payload forjado": bearer(forged),
      "sem o Bearer": token,
    };

    for (const [label, authorization] of Object.entries(cases)) {
      const calls = [
        request(app).get("/profile"),
        request(app).post("/incidents").send({ title: "x", description: "d", value: 1 }),
        request(app).delete(`/incidents/${id}`),
      ];
      for (const call of calls) {
        const res = await (authorization ? call.set("Authorization", authorization) : call);
        expect(res.status, `${label} → ${res.req.method} ${res.req.path}`).toBe(401);
        expect(res.body).toEqual({ message: "Token ausente, inválido ou expirado." });
      }
    }

    // Nada foi apagado nem criado por quem não tinha token válido.
    const profile = await request(app).get("/profile").set("Authorization", bearer(token));
    expect(profile.body).toHaveLength(1);
  });

  it("returns 400 for invalid input (with a valid token)", async () => {
    expect((await createIncident("")).status).toBe(400);
    expect((await request(app).get("/incidents?page=abc")).status).toBe(400);
    expect((await request(app).delete("/incidents/abc").set("Authorization", bearer(token))).status).toBe(400);
  });
});
