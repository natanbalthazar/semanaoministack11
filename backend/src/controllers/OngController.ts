import { Request, Response } from 'express';
import { db } from '../database';
import { ongs } from '../database/schema';
import { generateUniqueId } from '../utils/generateUniqueId';

export const OngController = {
  async index(_request: Request, response: Response) {
    const allOngs = await db.select().from(ongs);
    return response.json(allOngs);
  },

  async create(request: Request, response: Response) {
    // Faremos a desestruturação para pegar cada um dos dados de resposta separados
    const { name, email, whatsapp, city, uf } = request.body;

    // Para o id, utilizaremos o crypto para usar um método dele para gerar uma String aleatória
    const id = generateUniqueId();

    // Para fazer a inserção, utilizaremos o await para o node aguardar para então continuar
    await db.insert(ongs).values({
      id,
      name,
      email,
      whatsapp,
      city,
      uf,
    });

    // Vamos devolver apenas o id para o cliente. Isso porque quando a ong se cadastra,
    // ela precisa saber o id, visto que vai funcionar como um cpf/cnpj dentro do sistema.
    // Esse id que ela vai usar para se conectar dentro da aplicação.
    return response.json({ id });
  },
};
