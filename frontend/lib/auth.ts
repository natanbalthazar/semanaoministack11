const ONG_ID_KEY = "ongId";
const ONG_NAME_KEY = "ongName";

export function getOngId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ONG_ID_KEY);
}

export function getOngName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ONG_NAME_KEY);
}

export function setAuth(id: string, name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONG_ID_KEY, id);
  localStorage.setItem(ONG_NAME_KEY, name);
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ONG_ID_KEY);
  localStorage.removeItem(ONG_NAME_KEY);
}
