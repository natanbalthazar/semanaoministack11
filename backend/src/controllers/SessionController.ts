import { Request, Response } from 'express';
import { db } from '../database';
import { ongs } from '../database/schema';
import { eq } from 'drizzle-orm';

export const SessionController = {
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
