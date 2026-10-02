import type { Request, Response } from "express";
import { count, desc, eq } from "drizzle-orm";
import { db } from "../database";
import { incidents, ongs } from "../database/schema";

// Quantos casos por página em GET /incidents.
const PAGE_SIZE = 5;

export const IncidentController = {
  /**
   * GET /incidents?page=N → até 5 casos (mais novos primeiro) já com os dados da ONG.
   * O total geral vai no header `X-Total-Count`, para o front saber quando parar de paginar.
   * Sem `page` (ou `page=0`) → página 1.
   */
  async index(request: Request, response: Response) {
    // Quantidade de Casos
    const [{ total }] = await db.select({ total: count() }).from(incidents);
    response.setHeader("X-Total-Count", String(total));

    // Paginação
    const page = Number(request.query.page) || 1;

    const results = await db
      .select({
        id: incidents.id,
        title: incidents.title,
        description: incidents.description,
        value: incidents.value,
        // Na resposta a chave é `ong_id` (snake_case), como na versão original da API.
        ong_id: incidents.ongId,
        name: ongs.name,
        email: ongs.email,
        whatsapp: ongs.whatsapp,
        city: ongs.city,
        uf: ongs.uf,
      })
      .from(incidents)
      .innerJoin(ongs, eq(ongs.id, incidents.ongId))
      .orderBy(desc(incidents.id))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE);

    return response.json(results);
  },

  /**
   * POST /incidents: cria um caso para a ONG do header `Authorization`.
   * O header já foi validado na rota; aqui ele é só o "dono" do caso.
   * Atenção: com um ID de ONG inexistente o banco recusa o insert (chave estrangeira) e a API
   * responde 500. No Express 4 esse mesmo caso derrubava o servidor inteiro.
   */
  async create(request: Request, response: Response) {
    const { title, description, value } = request.body;
    const ongId = request.headers.authorization as string;

    const [{ id }] = await db
      .insert(incidents)
      .values({ title, description, value: String(value), ongId })
      .returning({ id: incidents.id });

    return response.json({ id });
  },

  /**
   * DELETE /incidents/:id
   * - caso não existe → 404
   * - caso existe, mas é de outra ONG (ou sem header `Authorization`) → 401
   * - caso é da ONG do header → 204 sem corpo
   */
  async delete(request: Request, response: Response) {
    const id = Number(request.params.id);
    const ongId = request.headers.authorization;

    // É necessário também buscar o id da ong para verificar se o nosso incidente
    // que está para ser deletado realmente foi criado pela ong que quer deletá-lo
    const [incident] = await db
      .select({ ongId: incidents.ongId })
      .from(incidents)
      .where(eq(incidents.id, id))
      .limit(1);

    if (!incident) {
      return response.status(404).json({ error: "Incident not found." });
    }

    if (incident.ongId !== ongId) {
      return response.status(401).json({ error: "Operation not permitted." });
    }

    await db.delete(incidents).where(eq(incidents.id, id));

    return response.status(204).send();
  },
};
