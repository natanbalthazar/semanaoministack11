import { Request, Response } from 'express';
import { db } from '../database';
import { incidents } from '../database/schema';
import { eq } from 'drizzle-orm';

export const ProfileController = {
  async index(request: Request, response: Response) {
    const ongId = request.headers.authorization as string;

    const ongIncidents = await db
      .select()
      .from(incidents)
      .where(eq(incidents.ongId, ongId));

    return response.json(ongIncidents);
  },
};
