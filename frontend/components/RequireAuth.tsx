"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export type Session = { token: string; ongName?: string | null };

/**
 * Protege páginas que exigem ONG logada.
 * - Se ainda está hidratando (`undefined`) → não renderiza nada (evita "piscar" a página).
 * - Se não há sessão (`null`) → redireciona para o logon. Isso também cobre o token expirado:
 *   a API responde 401 → `lib/api.ts` limpa a sessão → este componente redireciona.
 * - Se há sessão → renderiza `children`.
 *
 * Isso é proteção de interface, não de segurança: quem protege os dados é o backend,
 * que confere o token em cada requisição. Apagar este componente não dá acesso a nada.
 */
export function RequireAuth({ children }: { children: (session: Session) => React.ReactNode }) {
  const { token, ongName } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token === null) router.replace("/");
  }, [token, router]);

  return token ? children({ token, ongName }) : null;
}
