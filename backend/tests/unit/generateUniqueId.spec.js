const generateUniqueId = require('../../src/utils/generateUniqueId');

describe('Generate Unique ID', () => {
  it('should generate an unique ID', () => {
    // Criaremos um Id
    const id = generateUniqueId();

    // Validações em cima do Id

    expect(id).toHaveLength(8); //Espera que o id tenha 8 caracteres.
  });
});