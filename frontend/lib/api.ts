// Parte da URL que vai ser mantida em todas as chamadas
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function api<T>(path: string, options?: ApiOptions): Promise<T> {
  const { body, ...rest } = options ?? {};
  const config: RequestInit = {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...rest.headers,
    },
  };
  if (body !== undefined) {
    config.body = JSON.stringify(body);
    config.method = config.method ?? "POST";
  }
  const res = await fetch(`${API_URL}/${path.replace(/^\//, "")}`, config);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const json = await res.json();
    return json as T;
  }
  return undefined as unknown as T;
}

// Métodos auxiliares
export const apiGet = <T>(path: string, headers?: HeadersInit) =>
  api<T>(path, { method: "GET", headers });

export const apiPost = <T>(path: string, body: unknown, headers?: HeadersInit) =>
  api<T>(path, { method: "POST", body, headers });

export const apiDelete = (path: string, headers?: HeadersInit) =>
  api<unknown>(path, { method: "DELETE", headers });
