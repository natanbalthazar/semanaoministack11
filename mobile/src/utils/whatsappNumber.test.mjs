// Teste sem dependências: roda com `pnpm test` (node --test), fora do app.
// O Metro só empacota o que o app importa, então este arquivo não entra no bundle.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import toWhatsappNumber from './whatsappNumber.js';

test('coloca o 55 em DDD + celular (11 dígitos) e DDD + fixo (10 dígitos)', () => {
  assert.equal(toWhatsappNumber('11987654321'), '5511987654321');
  assert.equal(toWhatsappNumber('1133334444'), '551133334444');
});

test('ignora o que não é dígito', () => {
  assert.equal(toWhatsappNumber('(11) 98765-4321'), '5511987654321');
});

test('não duplica o 55 de quem já está no formato internacional', () => {
  assert.equal(toWhatsappNumber('5511987654321'), '5511987654321');
  assert.equal(toWhatsappNumber('+55 11 3333-4444'), '551133334444');
});
