import type { Request, Response } from 'express';
import { db } from '../database';
import { ongs } from '../database/schema';
import { eq } from 'drizzle-orm';
import { signToken } from '../auth/token';

export const SessionController = {
  /**
   * POST /sessions { id }: "login" da ONG. Como no curso, o ID da ONG é a credencial do login,
   * mas ele só trafega AQUI: a resposta traz um token assinado (válido por 7 dias) que o front
   * envia em `Authorization: Bearer <token>` nas rotas protegidas.
   * - ID existe → 200 { name, token }
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

    return response.json({ name: ong.name, token: signToken(id) });
  },
};
