import { describe, it, expect } from 'vitest';
import { generateUniqueId } from '../../src/utils/generateUniqueId';

describe('Generate Unique ID', () => {
  it('gera um ID hex de 32 caracteres (128 bits), diferente a cada chamada', () => {
    const id = generateUniqueId();
    expect(id).toMatch(/^[0-9a-f]{32}$/);
    expect(generateUniqueId()).not.toBe(id);
  });
});
