"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Provedores globais da aplicação (hoje só o React Query).
 *
 * Precisa de "use client" porque usa estado/contexto do React, que só existe no navegador.
 * O `app/layout.tsx` continua sendo Server Component: ele apenas renderiza este componente
 * cliente em volta das páginas — "use client" marca uma fronteira, não "contamina" o pai.
 *
 * O QueryClient é criado dentro de `useState` para existir UM por aba. Se fosse criado
 * no topo do módulo → no servidor ele seria compartilhado entre requisições de usuários
 * diferentes (vazando cache de um para o outro). Se fosse criado direto no corpo do
 * componente → cada re-render criaria um cliente novo e o cache seria perdido.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          // O padrão do React Query é tentar 3x com espera crescente. Aqui, se a API falhar
          // → mostramos o erro na hora (mesmo comportamento de antes, com fetch "na mão").
          queries: { retry: false },
        },
      }),
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
