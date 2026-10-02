import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

type FormCardProps = {
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
};

/**
 * Cartão com logo e texto à esquerda e formulário à direita (cadastro de ONG e de caso).
 *
 * Não tem "use client": é um Server Component por padrão. Mesmo assim pode ser usado
 * dentro de páginas cliente — nesse caso ele vira parte do bundle do cliente também.
 */
export function FormCard({ title, description, backHref, backLabel, children }: FormCardProps) {
  return (
    <div className="w-full max-w-[1120px] min-h-screen mx-auto flex items-center justify-center">
      <div className="w-full p-24 bg-gray-soft shadow-[0_0_100px_rgba(0,0,0,0.1)] rounded-lg flex justify-between items-center">
        <section className="w-full max-w-[380px]">
          <Image src="/logo.svg" alt="Be The Hero" width={250} height={106} preload />
          <h1 className="mt-16 mb-8 text-3xl font-bold">{title}</h1>
          <p className="text-lg text-gray-text leading-8">{description}</p>
          <Link href={backHref} className="back-link">
            <FiArrowLeft size={16} color="#E02041" />
            {backLabel}
          </Link>
        </section>
        {children}
      </div>
    </div>
  );
}
