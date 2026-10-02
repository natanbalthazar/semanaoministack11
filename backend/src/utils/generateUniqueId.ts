import crypto from "crypto";

/**
 * ID da ONG: 16 bytes aleatórios em hex = 32 caracteres (128 bits).
 *
 * Esse ID é a credencial do login, então precisa ser impossível de adivinhar.
 * Antes eram 4 bytes (8 caracteres, ~4 bilhões de combinações): um script tentando
 * POST /sessions sem parar acharia IDs válidos. Com 128 bits isso não é viável.
 * IDs antigos de 8 caracteres continuam funcionando (só os novos ficam maiores).
 * `randomBytes` usa o gerador criptográfico do sistema; NÃO use `Math.random()` para isso.
 */
export function generateUniqueId(): string {
  return crypto.randomBytes(16).toString("hex");
}
