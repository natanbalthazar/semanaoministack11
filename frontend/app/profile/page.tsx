"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiPower, FiTrash2 } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiDelete } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { RequireAuth, type Ong } from "@/components/RequireAuth";

type Incident = {
  id: number;
  title: string;
  description: string;
  value: string;
};

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function ProfilePage() {
  return <RequireAuth>{(ong) => <Profile {...ong} />}</RequireAuth>;
}

function Profile({ ongId, ongName }: Ong) {
  const router = useRouter();
  const { clearAuth } = useAuth();
  const queryClient = useQueryClient();

  // A chave identifica o cache. Inclui o ongId: se outra ONG logar → busca de novo,
  // em vez de mostrar os casos da ONG anterior.
  const queryKey = ["profile", ongId];
  const { data: incidents, isPending, isError } = useQuery({
    queryKey,
    queryFn: () => apiGet<Incident[]>("profile", { Authorization: ongId }),
  });

  const deleteIncident = useMutation({
    mutationFn: (id: number) => apiDelete(`incidents/${id}`, { Authorization: ongId }),
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
    <div className="w-full max-w-[1180px] px-8 my-8 mx-auto">
      <header className="flex items-center">
        <Image src="/logo.svg" alt="Be The Hero" width={200} height={85} preload />
        <span className="text-xl ml-6">Bem vinda, {ongName}</span>
        <Link href="/incidents/new" className="btn-primary w-[260px] ml-auto mt-0">
          Cadastrar novo caso
        </Link>
        <button
          onClick={handleLogout}
          type="button"
          aria-label="Sair"
          className="h-[60px] w-[60px] rounded-sm border border-gray-border bg-transparent ml-4 transition-colors hover:border-gray-400"
        >
          <FiPower size={18} color="#e02041" />
        </button>
      </header>

      <h1 className="mt-20 mb-6 text-2xl font-bold">Casos cadastrados</h1>

      {isPending ? (
        <p>Carregando...</p>
      ) : isError ? (
        <p role="alert" className="text-red-500">Erro ao carregar casos, tente novamente.</p>
      ) : incidents.length === 0 ? (
        <p className="text-gray-text">Nenhum caso cadastrado.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none">
          {incidents.map((incident) => (
            <li key={incident.id} className="bg-white p-6 rounded-lg relative">
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
                className="absolute right-6 top-6 border-0 bg-transparent hover:opacity-80"
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
