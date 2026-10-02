import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type ValidateSource = "body" | "query" | "params" | "headers";

/**
 * Middleware de validação: confere `req[source]` contra um schema Zod ANTES do controller.
 *
 * - Dado válido → chama `next()` e o controller roda.
 * - Dado inválido → responde 400 `{ message, details }` e o controller nem é chamado.
 *   Ex.: `POST /ongs` com `{ "email": "x" }` → 400 com a lista de campos com problema em `details`.
 *
 * Ele só barra; não substitui `req[source]` pelo valor convertido. No Express 5 o
 * `req.query` é somente leitura (getter), então NÃO faça `req.query = parsed`: lança TypeError.
 * Por isso os controllers continuam convertendo o que precisam (ex.: `Number(page)`).
 */
export function validate(schema: ZodType, source: ValidateSource) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", details: result.error.issues });
    }
    next();
  };
}
