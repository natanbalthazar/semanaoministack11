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
 * Responsivo "mobile-first": classes sem prefixo valem para o celular (seções empilhadas,
 * padding menor); as com `lg:` só entram a partir de 1024px e reproduzem o layout original
 * lado a lado. Como as duas páginas de formulário usam este componente, o ajuste fica aqui só.
 *
 * Não tem "use client": é um Server Component por padrão. Mesmo assim pode ser usado
 * dentro de páginas cliente — nesse caso ele vira parte do bundle do cliente também.
 */
export function FormCard({ title, description, backHref, backLabel, children }: FormCardProps) {
  return (
    <div className="w-full max-w-[1120px] min-h-screen mx-auto flex items-center justify-center px-4 py-6 lg:p-0">
      {/* Celular: coluna (flex-col) e o formulário estica (items-stretch, padrão do flex).
          lg: volta a ser linha, com texto e formulário nas pontas. */}
      <div className="w-full p-6 sm:p-12 lg:p-24 bg-gray-soft shadow-[0_0_100px_rgba(0,0,0,0.1)] rounded-lg flex flex-col gap-10 lg:flex-row lg:gap-0 lg:justify-between lg:items-center">
        <section className="w-full max-w-[380px]">
          {/* Logo menor no celular: `w-*` no CSS manda mais que o atributo width; h-auto mantém a proporção. */}
          <Image src="/logo.svg" alt="Be The Hero" width={250} height={106} preload className="w-[200px] h-auto lg:w-[250px]" />
          <h1 className="mt-8 lg:mt-16 mb-8 text-3xl font-bold">{title}</h1>
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
