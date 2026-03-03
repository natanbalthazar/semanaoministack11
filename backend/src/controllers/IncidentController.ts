import { Request, Response } from "express";
import { db } from "../database";
import { incidents, ongs } from "../database/schema";
import { eq, count, desc } from "drizzle-orm";

export const IncidentController = {
  async index(request: Request, response: Response) {
    // Quantidade de Casos
    const [countResult] = await db.select({ count: count() }).from(incidents);
    response.setHeader("X-Total-Count", String(countResult?.count ?? 0));

    // Paginação
    const { page = 1 } = request.query;
    const pageNum = Number(page) || 1;
    const limit = 5;
    const offset = (pageNum - 1) * limit;

    const results = await db
      .select({
        id: incidents.id,
        title: incidents.title,
        description: incidents.description,
        value: incidents.value,
        ongId: incidents.ongId,
        name: ongs.name,
        email: ongs.email,
        whatsapp: ongs.whatsapp,
        city: ongs.city,
        uf: ongs.uf,
      })
      .from(incidents)
      .innerJoin(ongs, eq(ongs.id, incidents.ongId))
      .orderBy(desc(incidents.id))
      .limit(limit)
      .offset(offset);

    // Formatar para compatibilidade com o formato anterior (incidents.* + ongs.*)
    const formatted = results.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      value: r.value,
      ong_id: r.ongId,
      name: r.name,
      email: r.email,
      whatsapp: r.whatsapp,
      city: r.city,
      uf: r.uf,
    }));

    return response.json(formatted);
  },

  async create(request: Request, response: Response) {
    const { title, description, value } = request.body;
    const ongId = request.headers.authorization as string;

    const [result] = await db
      .insert(incidents)
      .values({
        title,
        description,
        value: String(value),
        ongId,
      })
      .returning({ id: incidents.id });

    return response.json({ id: result?.id });
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const ongId = request.headers.authorization as string;

    // É necessário também buscar o id da ong para verificar se o nosso incidente
    // que está para ser deletado realmente foi criado pela ong que quer deletá-lo
    const [incident] = await db
      .select({ ongId: incidents.ongId })
      .from(incidents)
      .where(eq(incidents.id, Number(id)))
      .limit(1);

    if (!incident) {
      return response.status(404).json({ error: "Incident not found." });
    }

    if (incident.ongId !== ongId) {
      return response.status(401).json({ error: "Operation not permitted." });
    }

    await db.delete(incidents).where(eq(incidents.id, Number(id)));

    return response.status(204).send();
  },
};
