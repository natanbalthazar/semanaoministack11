"use client";

import { useSyncExternalStore } from "react";
import * as auth from "@/lib/auth";

/** Re-renderiza quando outra aba altera o localStorage (ex.: logout em outra aba). */
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
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
 * Valores de `ongId`: `undefined` = ainda hidratando · `null` = deslogado · string = logado.
 */
export function useAuth() {
  const ongId = useSyncExternalStore(subscribe, auth.getOngId, getServerSnapshot);
  const ongName = useSyncExternalStore(subscribe, auth.getOngName, getServerSnapshot);
  return { ongId, ongName, setAuth: auth.setAuth, clearAuth: auth.clearAuth };
}
