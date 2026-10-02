import type { Request, Response } from 'express';
import { db } from '../database';
import { ongs } from '../database/schema';
import { eq } from 'drizzle-orm';

export const SessionController = {
  /**
   * POST /sessions { id }: "login" da ONG. Não há senha nem token: o próprio ID é a credencial,
   * e o front passa a enviá-lo no header `Authorization` das próximas chamadas.
   * - ID existe → 200 { name }
   * - ID não existe → 400 { erro } (a chave é `erro` mesmo; o front pode depender dela, não renomeie)
   */
  async create(request: Request, response: Response) {
    const { id } = request.body;

    const [ong] = await db
      .select({ name: ongs.name })
      .from(ongs)
      .where(eq(ongs.id, id))
      .limit(1);

    if (!ong) {
      return response.status(400).json({ erro: 'No ONG found with this ID' });
    }

    return response.json(ong);
  },
};
