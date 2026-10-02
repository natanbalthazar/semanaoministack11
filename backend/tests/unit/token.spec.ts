import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { resolveSecret, signToken, verifyToken } from "../../src/auth/token";

const b64 = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
const decode = (part: string) => JSON.parse(Buffer.from(part, "base64url").toString());

describe("token (JWT HS256)", () => {
  it("assina e confere: devolve o ID da ONG do `sub`", () => {
    const token = signToken("ong123");
    expect(token.split(".")).toHaveLength(3);
    expect(verifyToken(token)).toBe("ong123");
  });

  it("payload é só base64: qualquer um lê (por isso nada de segredo nele)", () => {
    const now = Date.UTC(2026, 0, 1);
    const payload = decode(signToken("ong123", now).split(".")[1]);
    expect(payload).toEqual({ sub: "ong123", iat: now / 1000, exp: now / 1000 + 7 * 24 * 3600 });
  });

  it("rejeita payload alterado (trocar o `sub` para outra ONG)", () => {
    const [header, , signature] = signToken("ong123").split(".");
    const forged = b64({ sub: "outra-ong", iat: 0, exp: 9_999_999_999 });
    expect(verifyToken(`${header}.${forged}.${signature}`)).toBeNull();
  });

  it("rejeita assinatura alterada ou de tamanho diferente", () => {
    const token = signToken("ong123");
    const last = token.at(-1) === "A" ? "B" : "A";
    expect(verifyToken(token.slice(0, -1) + last)).toBeNull();
    expect(verifyToken(token.slice(0, -1))).toBeNull();
    expect(verifyToken(`${token}xx`)).toBeNull();
  });

  it("rejeita token expirado (7 dias depois)", () => {
    const now = Date.now();
    const token = signToken("ong123", now);
    const sevenDays = 7 * 24 * 3600 * 1000;
    expect(verifyToken(token, now + sevenDays - 1000)).toBe("ong123");
    expect(verifyToken(token, now + sevenDays)).toBeNull();
  });

  it("rejeita alg diferente de HS256, inclusive `none`", () => {
    const payload = b64({ sub: "ong123", iat: 0, exp: 9_999_999_999 });
    expect(verifyToken(`${b64({ alg: "none", typ: "JWT" })}.${payload}.`)).toBeNull();
    // Mesmo assinado "certo" com um segredo qualquer, o alg do header não escolhe o algoritmo.
    const header = b64({ alg: "HS512", typ: "JWT" });
    const sig = createHmac("sha256", "chute").update(`${header}.${payload}`).digest("base64url");
    expect(verifyToken(`${header}.${payload}.${sig}`)).toBeNull();
  });

  it("rejeita formatos inválidos", () => {
    for (const bad of ["", "abc", "a.b", "a.b.c.d", "...", "ong123"]) {
      expect(verifyToken(bad)).toBeNull();
    }
  });

  it("AUTH_SECRET: obrigatório em produção, aleatório em dev", () => {
    expect(() => resolveSecret({ NODE_ENV: "production" })).toThrow(/AUTH_SECRET/);
    expect(() => resolveSecret({ NODE_ENV: "production", AUTH_SECRET: "curto" })).toThrow(/32/);
    const strong = "x".repeat(32);
    expect(resolveSecret({ NODE_ENV: "production", AUTH_SECRET: strong })).toBe(strong);
    const a = resolveSecret({ NODE_ENV: "test" });
    expect(a).toHaveLength(64);
    expect(resolveSecret({ NODE_ENV: "test" })).not.toBe(a);
  });
});
