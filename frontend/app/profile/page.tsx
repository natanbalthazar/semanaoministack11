"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiPower, FiTrash2 } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiDelete } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { RequireAuth, type Session } from "@/components/RequireAuth";

type Incident = {
  id: number;
  title: string;
  description: string;
  value: string;
};

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function ProfilePage() {
  return <RequireAuth>{(session) => <Profile {...session} />}</RequireAuth>;
}

function Profile({ token, ongName }: Session) {
  const router = useRouter();
  const { clearAuth } = useAuth();
  const queryClient = useQueryClient();

  // A chave identifica o cache. Inclui o token: se outra ONG logar → busca de novo,
  // em vez de mostrar os casos da ONG anterior.
  const queryKey = ["profile", token];
  const { data: incidents, isPending, isError } = useQuery({
    queryKey,
    // `auth: true` → o lib/api.ts envia o Bearer token (e trata o 401). Nada de header na mão.
    queryFn: () => apiGet<Incident[]>("profile", { auth: true }),
  });

  const deleteIncident = useMutation({
    mutationFn: (id: number) => apiDelete(`incidents/${id}`, { auth: true }),
    // Atualiza o cache localmente em vez de buscar a lista inteira de novo.
    onSuccess: (_, id) =>
      queryClient.setQueryData<Incident[]>(queryKey, (prev) => prev?.filter((i) => i.id !== id)),
    onError: () => alert("Erro ao deletar caso, tente novamente."),
  });

  function handleLogout() {
    clearAuth();
    router.push("/");
  }

  return (
    <div className="w-full max-w-[1180px] px-4 lg:px-8 my-8 mx-auto">
      {/* Celular: o header quebra em linhas (flex-wrap) e `order-*` reorganiza sem mudar o HTML:
          1ª linha logo + sair, 2ª a saudação, 3ª o botão em largura total.
          lg: uma linha só, na ordem do HTML (lg:order-none), como no layout original. */}
      <header className="flex flex-wrap items-center gap-y-6 lg:flex-nowrap">
        <Image src="/logo.svg" alt="Be The Hero" width={200} height={85} preload className="w-40 h-auto lg:w-[200px]" />
        <span className="order-3 basis-full min-w-0 wrap-break-word text-xl lg:order-none lg:basis-auto lg:ml-6">
          Bem vinda, {ongName}
        </span>
        <Link href="/incidents/new" className="btn-primary order-4 mt-0 lg:order-none lg:w-[260px] lg:ml-auto">
          Cadastrar novo caso
        </Link>
        <button
          onClick={handleLogout}
          type="button"
          aria-label="Sair"
          className="order-2 ml-auto h-[60px] w-[60px] shrink-0 rounded-sm border border-gray-border bg-transparent lg:order-none lg:ml-4 transition-colors hover:border-gray-400"
        >
          <FiPower size={18} color="#e02041" />
        </button>
      </header>

      <h1 className="mt-12 lg:mt-20 mb-6 text-2xl font-bold">Casos cadastrados</h1>

      {isPending ? (
        <p>Carregando...</p>
      ) : isError ? (
        <p role="alert" className="text-red-500">Erro ao carregar casos, tente novamente.</p>
      ) : incidents.length === 0 ? (
        <p className="text-gray-text">Nenhum caso cadastrado.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none">
          {incidents.map((incident) => (
            <li key={incident.id} className="bg-white p-6 rounded-lg relative wrap-break-word">
              <strong className="block mb-4 text-gray-dark">CASO:</strong>
              <p className="text-gray-text leading-5 text-base">{incident.title}</p>

              <strong className="block mt-8 mb-4 text-gray-dark">DESCRIÇÃO:</strong>
              <p className="text-gray-text leading-5 text-base">{incident.description}</p>

              <strong className="block mt-8 mb-4 text-gray-dark">VALOR:</strong>
              <p className="text-gray-text leading-5 text-base">
                {currency.format(Number(incident.value))}
              </p>

              <button
                onClick={() => deleteIncident.mutate(incident.id)}
                type="button"
                aria-label={`Excluir caso ${incident.title}`}
                // p-3 + right-3/top-3: o ícone fica no mesmo lugar, mas a área de toque vira 44px.
                className="absolute right-3 top-3 p-3 border-0 bg-transparent hover:opacity-80"
              >
                <FiTrash2 size={20} color="#a8a8b3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
