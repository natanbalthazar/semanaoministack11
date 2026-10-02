import type { Request, Response } from 'express';
import { db } from '../database';
import { incidents } from '../database/schema';
import { eq } from 'drizzle-orm';

export const ProfileController = {
  /**
   * GET /profile: casos da ONG cujo ID veio no header `Authorization` (validado na rota).
   * ID desconhecido → 200 com lista vazia (não é erro).
   * Aqui a chave sai como `ongId` (camelCase), diferente de GET /incidents (`ong_id`): é o contrato atual.
   */
  async index(request: Request, response: Response) {
    const ongId = request.headers.authorization as string;

    const ongIncidents = await db
      .select()
      .from(incidents)
      .where(eq(incidents.ongId, ongId));

    return response.json(ongIncidents);
  },
};
