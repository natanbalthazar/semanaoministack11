/**
 * "Sessão" da ONG guardada no localStorage do navegador.
 *
 * O backend não usa token: o ID da ONG É a credencial, enviada no header `Authorization`.
 * Isso é didático, não seguro — qualquer script na página consegue ler o localStorage.
 *
 * Estas funções só existem no navegador. Se forem chamadas no servidor (durante a
 * renderização de um Server Component ou no SSR) → `ReferenceError: localStorage is not defined`.
 * Em componentes, leia a sessão pelo hook `useAuth`, que já trata esse caso.
 */
const ONG_ID_KEY = "ongId";
const ONG_NAME_KEY = "ongName";

export const getOngId = () => localStorage.getItem(ONG_ID_KEY);

export const getOngName = () => localStorage.getItem(ONG_NAME_KEY);

export function setAuth(id: string, name: string) {
  localStorage.setItem(ONG_ID_KEY, id);
  localStorage.setItem(ONG_NAME_KEY, name);
}

export function clearAuth() {
  localStorage.removeItem(ONG_ID_KEY);
  localStorage.removeItem(ONG_NAME_KEY);
}
