import type { Request, Response } from 'express';
import { db } from '../database';
import { incidents } from '../database/schema';
import { eq } from 'drizzle-orm';
import type { AuthLocals } from '../auth/middleware';

export const ProfileController = {
  /**
   * GET /profile: casos da ONG dona do token (o `ensureAuthenticated` da rota já o conferiu).
   * Aqui a chave sai como `ongId` (camelCase), diferente de GET /incidents (`ong_id`): é o contrato atual.
   */
  async index(_request: Request, response: Response<unknown, AuthLocals>) {
    const { ongId } = response.locals;

    const ongIncidents = await db
      .select()
      .from(incidents)
      .where(eq(incidents.ongId, ongId));

    return response.json(ongIncidents);
  },
};
