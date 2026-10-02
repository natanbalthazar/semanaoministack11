/**
 * Sessão da ONG guardada no navegador.
 *
 * Após o logon o backend devolve um token (JWT) assinado. Guardamos o token e o nome (só para
 * exibir). O ID da ONG NÃO fica salvo: ele só serve no logon, as outras chamadas usam o token.
 *
 * localStorage é simples, mas qualquer script rodando na página consegue lê-lo: se o site tiver
 * uma falha de XSS → o token pode ser roubado e usado até expirar (7 dias). A alternativa mais
 * segura é um cookie `HttpOnly` definido pelo backend (o JS não o enxerga). Mantivemos
 * localStorage por ser didático; o token ao menos expira, ao contrário do ID, que era eterno.
 *
 * Estas funções só existem no navegador. Se forem chamadas no servidor (durante a
 * renderização de um Server Component ou no SSR) → `ReferenceError: localStorage is not defined`.
 * Em componentes, leia a sessão pelo hook `useAuth`, que já trata esse caso.
 */
const TOKEN_KEY = "token";
const ONG_NAME_KEY = "ongName";
const LEGACY_ONG_ID_KEY = "ongId"; // versão antiga guardava o ID cru; limpamos ao logar/sair
const NOTICE_KEY = "authNotice"; // aviso para a tela de logon (ex.: sessão expirada)

/** Evento para avisar ESTA aba (o evento `storage` nativo só dispara nas OUTRAS abas). */
export const AUTH_CHANGE_EVENT = "auth-change";
const notify = () => window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getOngName = () => localStorage.getItem(ONG_NAME_KEY);

/** Mensagem para mostrar no logon. Fica no sessionStorage: some ao fechar a aba. */
export const getNotice = () => sessionStorage.getItem(NOTICE_KEY);

export function setAuth(token: string, name: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ONG_NAME_KEY, name);
  localStorage.removeItem(LEGACY_ONG_ID_KEY);
  sessionStorage.removeItem(NOTICE_KEY);
  notify();
}

/** Encerra a sessão. Com `notice` → o logon exibe essa mensagem (ex.: token expirado). */
export function clearAuth(notice?: string) {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ONG_NAME_KEY);
  localStorage.removeItem(LEGACY_ONG_ID_KEY);
  if (notice) sessionStorage.setItem(NOTICE_KEY, notice);
  else sessionStorage.removeItem(NOTICE_KEY);
  notify();
}
