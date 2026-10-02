import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

// next/font baixa a fonte no build e a serve do próprio site (sem requisição ao Google em produção).
// `variable` cria a CSS var --font-roboto, usada como fonte padrão em app/globals.css.
const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-roboto" });

export const metadata: Metadata = {
  title: "Be The Hero",
  description: "Conecte ONGs e pessoas dispostas a ajudar casos.",
};

/**
 * Layout raiz: envolve todas as páginas. Sem "use client", então é um Server Component —
 * roda só no servidor, pode exportar `metadata` e não manda JavaScript próprio ao navegador.
 * Hooks (useState, useEffect...) NÃO funcionam aqui; o que for interativo vai em
 * componentes cliente, como o <Providers>.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={roboto.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
