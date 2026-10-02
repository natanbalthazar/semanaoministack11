import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "./token";

/** O que `ensureAuthenticated` deixa pronto para o controller em `response.locals`. */
export type AuthLocals = { ongId: string };

/**
 * Protege uma rota: exige `Authorization: Bearer <token>` válido.
 *
 * - Sem header, formato errado, token alterado ou expirado → 401 `{ message }` e o controller nem roda.
 * - Token válido → `response.locals.ongId` recebe o ID da ONG (tirado do token, não do cliente).
 *
 * Regressão importante: o formato antigo `Authorization: <id da ONG>` NÃO funciona mais.
 * Antes, quem soubesse o ID de uma ONG (e GET /ongs listava todos!) agia em nome dela.
 * Agora o ID só vale no login; nas outras rotas vale o token, que só o servidor sabe assinar.
 */
export function ensureAuthenticated(
  request: Request,
  response: Response<unknown, AuthLocals>,
  next: NextFunction,
) {
  const [, token] = request.headers.authorization?.match(/^Bearer (\S+)$/i) ?? [];
  const ongId = token ? verifyToken(token) : null;

  if (!ongId) {
    return response.status(401).json({ message: "Token ausente, inválido ou expirado." });
  }

  response.locals.ongId = ongId;
  next();
}

/**
 * Limite de tentativas por IP (ex.: 10 por minuto). Passou disso → 429 com `Retry-After`.
 * Serve para frear quem tenta adivinhar IDs de ONG no POST /sessions (força bruta).
 *
 * ponytail: contador em memória e por processo. Teto: com 2+ instâncias cada uma conta separado,
 * e reiniciar zera tudo. Atrás de proxy/load balancer todos chegam com o IP do proxy
 * (configure `app.set("trust proxy", ...)`). Precisou escalar → Redis ou o rate limit do gateway.
 */
export function rateLimit(limit: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (request: Request, response: Response, next: NextFunction) => {
    const now = Date.now();
    const key = request.ip ?? "desconhecido";
    let entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      // Limpa janelas vencidas de vez em quando para o Map não crescer sem fim.
      if (hits.size > 10_000) {
        for (const [ip, e] of hits) if (e.resetAt <= now) hits.delete(ip);
      }
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count++;
    if (entry.count > limit) {
      response.setHeader("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
      return response.status(429).json({ message: "Muitas tentativas. Tente novamente em instantes." });
    }
    next();
  };
}
