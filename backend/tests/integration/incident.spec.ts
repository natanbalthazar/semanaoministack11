import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
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

// Cobre o contrato que o frontend e o mobile usam: status, header X-Total-Count e formato das respostas.
describe("Incidents", () => {
  let ongId: string;

  beforeAll(runMigrations);

  beforeEach(async () => {
    await db.delete(incidents);
    await db.delete(ongs);
    ongId = (await request(app).post("/ongs").send(ong)).body.id;
  });

  const createIncident = (title: string, authorization = ongId) =>
    request(app)
      .post("/incidents")
      .set("Authorization", authorization)
      .send({ title, description: "d", value: 120 });

  it("logs in with an existing ONG id and rejects an unknown one", async () => {
    const ok = await request(app).post("/sessions").send({ id: ongId });
    expect(ok.status).toBe(200);
    expect(ok.body).toEqual({ name: ong.name });

    const unknown = await request(app).post("/sessions").send({ id: "naoexiste" });
    expect(unknown.status).toBe(400);
    expect(unknown.body).toEqual({ erro: "No ONG found with this ID" });
  });

  it("paginates 5 per page, newest first, with X-Total-Count", async () => {
    for (let i = 1; i <= 6; i++) await createIncident(`Caso ${i}`);

    const page1 = await request(app).get("/incidents");
    expect(page1.headers["x-total-count"]).toBe("6");
    expect(page1.body).toHaveLength(5);
    expect(page1.body[0]).toMatchObject({ title: "Caso 6", value: "120", ong_id: ongId, ...ong });

    // O navegador só deixa o JS ler X-Total-Count se o CORS expuser o header (app web/Expo web).
    const cross = await request(app).get("/incidents").set("Origin", "http://localhost:8081");
    expect(cross.headers["access-control-expose-headers"]).toBe("X-Total-Count");

    const page2 = await request(app).get("/incidents?page=2");
    expect(page2.body.map((i: { title: string }) => i.title)).toEqual(["Caso 1"]);
  });

  it("lists only the authenticated ONG incidents in /profile", async () => {
    await createIncident("Caso 1");
    const profile = await request(app).get("/profile").set("Authorization", ongId);
    expect(profile.body).toEqual([expect.objectContaining({ title: "Caso 1", ongId })]);

    expect((await request(app).get("/profile")).status).toBe(400);
  });

  it("only lets the owner ONG delete an incident", async () => {
    const { id } = (await createIncident("Caso 1")).body;
    const other = (await request(app).post("/ongs").send(ong)).body.id;

    expect((await request(app).delete(`/incidents/${id}`).set("Authorization", other)).status).toBe(401);
    expect((await request(app).delete(`/incidents/${id}`)).status).toBe(401);
    expect((await request(app).delete(`/incidents/${id}`).set("Authorization", ongId)).status).toBe(204);
    expect((await request(app).delete(`/incidents/${id}`).set("Authorization", ongId)).status).toBe(404);
  });

  it("returns 400 for invalid input", async () => {
    expect((await request(app).post("/incidents").send({ title: "x", description: "d", value: 1 })).status).toBe(400);
    expect((await createIncident("")).status).toBe(400);
    expect((await request(app).get("/incidents?page=abc")).status).toBe(400);
    expect((await request(app).delete("/incidents/abc")).status).toBe(400);
  });
});
