"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export type Ong = { ongId: string; ongName?: string | null };

/**
 * Protege páginas que exigem ONG logada.
 * - Se ainda está hidratando (`undefined`) → não renderiza nada (evita "piscar" a página).
 * - Se não há sessão (`null`) → redireciona para o logon.
 * - Se há sessão → renderiza `children` já com um `ongId` garantidamente `string`.
 *
 * Isso é proteção de interface, não de segurança: quem protege os dados é o backend,
 * que confere o header `Authorization` em cada requisição.
 */
export function RequireAuth({ children }: { children: (ong: Ong) => React.ReactNode }) {
  const { ongId, ongName } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ongId === null) router.replace("/");
  }, [ongId, router]);

  return ongId ? children({ ongId, ongName }) : null;
}
