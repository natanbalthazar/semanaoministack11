import { clearAuth, getToken } from "@/lib/auth";

/**
 * Cliente HTTP da aplicação: um `fetch` com URL base, JSON, token e tratamento de erro.
 *
 * Variáveis `NEXT_PUBLIC_*` são embutidas no JavaScript do navegador NO MOMENTO DO BUILD:
 * - se você mudar `NEXT_PUBLIC_API_URL` depois do `pnpm build` → nada muda até buildar de novo;
 * - se a variável não existir → usamos o backend local (http://localhost:3333).
 * Nunca coloque segredos (tokens, senhas) em `NEXT_PUBLIC_*`: qualquer pessoa os vê no navegador.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

/** `auth: true` → rota protegida: envia `Authorization: Bearer <token>` da sessão. */
type Options = { auth?: boolean };

export const SESSION_EXPIRED_MESSAGE = "Sua sessão expirou. Faça logon novamente.";

/**
 * Faz a requisição e devolve a `Response` só se o status for 2xx.
 * - Rota protegida respondeu 401 (token expirado/inválido) → limpa a sessão com um aviso;
 *   o `RequireAuth` percebe e leva para o logon, que mostra a mensagem. As páginas não
 *   precisam tratar isso uma a uma.
 * - Outros 4xx/5xx → lança `Error` com o corpo da resposta (ou "HTTP <status>"),
 *   e quem chamou decide a mensagem para o usuário (try/catch ou `isError` do React Query).
 * - Rede caiu (backend desligado, CORS) → o próprio `fetch` lança `TypeError`.
 */
async function request(path: string, init: RequestInit, { auth = false }: Options = {}) {
  const token = auth ? getToken() : null;
  const res = await fetch(`${API_URL}/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (res.status === 401 && auth) {
    clearAuth(SESSION_EXPIRED_MESSAGE);
  }
  if (!res.ok) {
    throw new Error((await res.text()) || `HTTP ${res.status}`);
  }
  return res;
}

// `res.json()` devolve `Promise<any>`: o `<T>` só DESCREVE o formato esperado,
// ele não valida nada em tempo de execução (para isso existiria um schema zod da resposta).

export async function apiGet<T>(path: string, options?: Options): Promise<T> {
  const res = await request(path, { method: "GET" }, options);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown, options?: Options): Promise<T> {
  const res = await request(path, { method: "POST", body: JSON.stringify(body) }, options);
  return res.json();
}

/** O backend responde 204 (sem corpo) no DELETE, então não há JSON para ler. */
export async function apiDelete(path: string, options?: Options): Promise<void> {
  await request(path, { method: "DELETE" }, options);
}
