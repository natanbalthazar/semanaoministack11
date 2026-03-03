import { describe, it, expect } from 'vitest';
import { generateUniqueId } from '../../src/utils/generateUniqueId';

describe('Generate Unique ID', () => {
  it('should generate an unique ID', () => {
    // Criaremos um Id
    const id = generateUniqueId();

    // Validações em cima do Id - espera que o id tenha 8 caracteres
    expect(id).toHaveLength(8);
  });
});
