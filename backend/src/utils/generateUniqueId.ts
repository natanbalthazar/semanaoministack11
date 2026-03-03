import crypto from "crypto";

/**
 * Para o id, utilizaremos o crypto para usar um método dele para gerar uma String aleatória.
 */
export function generateUniqueId(): string {
  return crypto.randomBytes(4).toString("hex");
}
