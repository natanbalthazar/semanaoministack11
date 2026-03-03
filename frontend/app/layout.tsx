import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-roboto" });

export const metadata: Metadata = {
  title: "Be The Hero",
  description: "Conecte ONGs e pessoas dispostas a ajudar casos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${roboto.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
