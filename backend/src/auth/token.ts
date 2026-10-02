import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/*
 * Token de acesso no formato JWT (JSON Web Token), feito só com `node:crypto` (sem biblioteca).
 *
 * Um JWT "compacto" são 3 partes em base64url separadas por ponto:
 *
 *   base64url(header) . base64url(payload) . base64url(assinatura)
 *   {"alg":"HS256",...}  {"sub":"<ongId>",...}  HMAC-SHA256(header.payload, segredo)
 *
 * - header: qual algoritmo assinou o token. Aqui é sempre HS256.
 * - payload: os "claims". `sub` (subject) = ID da ONG; `iat` = emitido em; `exp` = expira em
 *   (ambos em SEGUNDOS desde 1970, como manda a especificação).
 * - assinatura: HMAC = hash com uma chave secreta (AUTH_SECRET) que só o servidor conhece.
 *   Se alguém trocar o `sub` para o ID de outra ONG → a assinatura não bate mais → 401.
 *   Sem o segredo não dá para gerar uma assinatura válida para o payload alterado.
 *
 * ATENÇÃO: base64 NÃO é criptografia. Qualquer pessoa decodifica o payload (cole um token em
 * jwt.io e veja). Por isso NUNCA coloque segredos no payload (senha, CPF, dados sensíveis):
 * a assinatura garante que ninguém ALTEROU o conteúdo, não que ninguém o LEU.
 *
 * Por que não usar uma lib como `jsonwebtoken`? Em produção, use uma lib madura. Aqui o código
 * tem ~60 linhas e serve para estudar o que acontece por dentro. O que NÃO fazer (bugs clássicos
 * de implementações caseiras, evitados abaixo):
 * - escolher o algoritmo pelo `alg` do header → atacante manda `"alg":"none"` e pula a assinatura;
 * - comparar a assinatura com `===` → vaza tempo (ver `safeEqual`);
 * - esquecer de checar `exp` → token vale para sempre;
 * - usar segredo fraco/fixo no código → qualquer um que leia o repositório forja tokens.
 */

const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;
const HEADER = { alg: "HS256", typ: "JWT" };

/**
 * Lê o segredo de assinatura do ambiente.
 * - `AUTH_SECRET` definido (>= 32 caracteres em produção) → usa ele.
 * - Produção sem `AUTH_SECRET` (ou curto demais) → lança erro e o servidor NÃO sobe (fail fast):
 *   melhor cair na hora do deploy do que rodar com um segredo adivinhável.
 * - Dev/teste sem `AUTH_SECRET` → gera um aleatório por processo. Efeito colateral: reiniciou o
 *   servidor (ou o `tsx watch` recarregou) → todos os tokens antigos viram inválidos → 401 → logon de novo.
 */
export function resolveSecret(env: NodeJS.ProcessEnv = process.env): string {
  const secret = env.AUTH_SECRET;
  if (env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
    throw new Error(
      "AUTH_SECRET é obrigatório em produção (mínimo 32 caracteres). " +
        "Gere um com: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }
  if (secret) return secret;
  if (env.NODE_ENV !== "test") {
    console.warn(
      "[auth] AUTH_SECRET não definido: usando um segredo aleatório. Os tokens deixam de valer quando o servidor reinicia.",
    );
  }
  return randomBytes(32).toString("hex");
}

// Resolvido uma vez, ao carregar o módulo (= ao subir o servidor). É aqui que o fail fast acontece.
const SECRET = resolveSecret();

const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");

const sign = (data: string) => createHmac("sha256", SECRET).update(data).digest("base64url");

/**
 * Compara as assinaturas em tempo constante.
 * Com `===` a comparação para no primeiro caractere diferente: medindo o tempo de resposta,
 * um atacante descobre a assinatura byte a byte. `timingSafeEqual` sempre olha todos os bytes.
 * Ele lança erro se os tamanhos forem diferentes, então checamos o tamanho antes
 * (o tamanho de uma assinatura HS256 não é segredo: são sempre 43 caracteres).
 */
function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/** Gera um token para a ONG, válido por 7 dias. `now` (ms) existe para os testes controlarem o relógio. */
export function signToken(ongId: string, now = Date.now()): string {
  const iat = Math.floor(now / 1000);
  const data = `${encode(HEADER)}.${encode({ sub: ongId, iat, exp: iat + SEVEN_DAYS_IN_SECONDS })}`;
  return `${data}.${sign(data)}`;
}

/**
 * Confere o token e devolve o ID da ONG (`sub`), ou `null` se ele não puder ser aceito:
 * formato errado, assinatura não bate (payload ou assinatura alterados), `alg` diferente de HS256
 * ou já expirou. Quem chama não precisa saber o motivo: para o cliente é sempre 401.
 */
export function verifyToken(token: string, now = Date.now()): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;

  // Assinatura PRIMEIRO, sempre com HS256 (nunca com o algoritmo que o token "diz" usar).
  if (!safeEqual(signature, sign(`${header}.${payload}`))) return null;

  try {
    const { alg } = JSON.parse(Buffer.from(header, "base64url").toString());
    const { sub, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (alg !== "HS256" || typeof sub !== "string" || typeof exp !== "number") return null;
    return Math.floor(now / 1000) < exp ? sub : null;
  } catch {
    return null; // JSON inválido dentro do token
  }
}
