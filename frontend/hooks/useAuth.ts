"use client";

import { useSyncExternalStore } from "react";
import * as auth from "@/lib/auth";

/**
 * Re-renderiza quando a sessão muda:
 * - `storage` → outra aba alterou o localStorage (ex.: logout em outra aba);
 * - `auth-change` → esta aba chamou setAuth/clearAuth (ex.: a API respondeu 401).
 */
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(auth.AUTH_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(auth.AUTH_CHANGE_EVENT, onChange);
  };
}

/** No servidor não há localStorage: `undefined` significa "ainda não sei se está logado". */
const getServerSnapshot = () => undefined;

/**
 * Lê a sessão da ONG sem quebrar a hidratação.
 *
 * Por que não ler `localStorage` direto no render? O HTML vem do servidor (sem sessão) e o
 * React compara com o primeiro render do navegador (com sessão). Se forem diferentes →
 * erro "Hydration failed" e a árvore inteira é recriada no cliente.
 * O `useSyncExternalStore` resolve: na hidratação usa `getServerSnapshot` (igual ao servidor)
 * e logo em seguida re-renderiza com o valor real do navegador.
 *
 * Valores de `token`: `undefined` = ainda hidratando · `null` = deslogado · string = logado.
 * (Ter token não garante que ele ainda vale: quem decide é o backend. Se ele responder 401,
 * `lib/api.ts` limpa a sessão e o `RequireAuth` manda para o logon.)
 */
export function useAuth() {
  const token = useSyncExternalStore(subscribe, auth.getToken, getServerSnapshot);
  const ongName = useSyncExternalStore(subscribe, auth.getOngName, getServerSnapshot);
  const notice = useSyncExternalStore(subscribe, auth.getNotice, getServerSnapshot);
  return { token, ongName, notice, setAuth: auth.setAuth, clearAuth: auth.clearAuth };
}
