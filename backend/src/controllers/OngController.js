const connection = require('../database/connection'); // Para podemos utilizar comandos do banco
const crypto = require('crypto'); // Pacote que vem junto do Node

module.exports = {

  async index(request, response) {
    const ongs = await connection('ongs').select('*');
    return response.json(ongs);
  },

  async create(request, response) {
    // const data = request.body; console.log(data);

    // Faremos a desestruturação para pegar cada um dos dados de resposta separados:
    const { name, email, whatsapp, city, uf } = request.body;

    // Para o id, utilizaremos o crypto para usar um método dele para gerar uma String aleatória.
    const id = crypto.randomBytes(4).toString('HEX');

    // Para fazer a conexão, utilizaremos o await para o node aguardar para então continuar
    await connection('ongs').insert({
      id,
      name,
      email,
      whatsapp,
      city,
      uf,
    })

    return response.json({ id });
    /* Vamos devolver apenas o id para o cliente. Isso porque quando a ong se cadastra,
    ela precisa saber o id, visto que vai funcionar como um cpf/cnpj dentro do sistema.
    Esse id que ela vai usar para se conectar dentro da aplicação.
    */
  }

}