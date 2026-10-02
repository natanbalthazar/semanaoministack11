/**
 * Cliente HTTP da aplicação: um `fetch` com URL base, JSON e tratamento de erro.
 *
 * Variáveis `NEXT_PUBLIC_*` são embutidas no JavaScript do navegador NO MOMENTO DO BUILD:
 * - se você mudar `NEXT_PUBLIC_API_URL` depois do `pnpm build` → nada muda até buildar de novo;
 * - se a variável não existir → usamos o backend local (http://localhost:3333).
 * Nunca coloque segredos (tokens, senhas) em `NEXT_PUBLIC_*`: qualquer pessoa os vê no navegador.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

/** Cabeçalhos extras. Ex.: `{ Authorization: ongId }` nas rotas que exigem login. */
type ExtraHeaders = Record<string, string>;

/**
 * Faz a requisição e devolve a `Response` só se o status for 2xx.
 * Se a API responder 4xx/5xx → lança `Error` com o corpo da resposta (ou "HTTP <status>"),
 * e quem chamou decide a mensagem para o usuário (try/catch ou `isError` do React Query).
 * Se a rede cair (backend desligado, CORS) → o próprio `fetch` lança `TypeError`.
 */
async function request(path: string, init: RequestInit & { headers?: ExtraHeaders }) {
  const res = await fetch(`${API_URL}/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  if (!res.ok) {
    throw new Error((await res.text()) || `HTTP ${res.status}`);
  }
  return res;
}

// `res.json()` devolve `Promise<any>`: o `<T>` só DESCREVE o formato esperado,
// ele não valida nada em tempo de execução (para isso existiria um schema zod da resposta).

export async function apiGet<T>(path: string, headers?: ExtraHeaders): Promise<T> {
  const res = await request(path, { method: "GET", headers });
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown, headers?: ExtraHeaders): Promise<T> {
  const res = await request(path, { method: "POST", body: JSON.stringify(body), headers });
  return res.json();
}

/** O backend responde 204 (sem corpo) no DELETE, então não há JSON para ler. */
export async function apiDelete(path: string, headers?: ExtraHeaders): Promise<void> {
  await request(path, { method: "DELETE", headers });
}
