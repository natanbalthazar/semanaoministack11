"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiPower, FiTrash2 } from "react-icons/fi";
import { apiGet, apiDelete } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface Incident {
  id: number;
  title: string;
  description: string;
  value: string;
}

export default function ProfilePage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const { ongId, ongName, clearAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ongId) {
      router.replace("/");
      return;
    }
    apiGet<Incident[]>("profile", {
      Authorization: ongId,
    })
      .then(setIncidents)
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  }, [ongId, router]);

  async function handleDeleteIncident(id: number) {
    if (!ongId) return;
    try {
      await apiDelete(`incidents/${id}`, { Authorization: ongId });
      setIncidents((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Erro ao deletar caso, tente novamente.");
    }
  }

  function handleLogout() {
    clearAuth();
    router.push("/");
  }

  if (!ongId && !loading) return null;

  return (
    <div className="w-full max-w-[1180px] px-8 my-8 mx-auto">
      <header className="flex items-center">
        <Image src="/logo.svg" alt="Be The Hero" width={200} height={64} />
        <span className="text-xl ml-6">Bem vinda, {ongName}</span>
        <Link href="/incidents/new" className="btn-primary w-[260px] ml-auto mt-0">
          Cadastrar novo caso
        </Link>
        <button
          onClick={handleLogout}
          type="button"
          className="h-[60px] w-[60px] rounded border border-gray-border bg-transparent ml-4 transition-colors hover:border-gray-400"
        >
          <FiPower size={18} color="#e02041" />
        </button>
      </header>

      <h1 className="mt-20 mb-6 text-2xl font-bold">Casos cadastrados</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : incidents.length === 0 ? (
        <p className="text-gray-text">Nenhum caso cadastrado.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none">
          {incidents.map((incident) => (
            <li
              key={incident.id}
              className="bg-white p-6 rounded-lg relative"
            >
              <strong className="block mb-4 text-gray-dark">CASO:</strong>
              <p className="text-gray-text leading-5 text-base">
                {incident.title}
              </p>

              <strong className="block mt-8 mb-4 text-gray-dark">DESCRIÇÃO:</strong>
              <p className="text-gray-text leading-5 text-base">
                {incident.description}
              </p>

              <strong className="block mt-8 mb-4 text-gray-dark">VALOR:</strong>
              <p className="text-gray-text leading-5 text-base">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(incident.value))}
              </p>

              <button
                onClick={() => handleDeleteIncident(incident.id)}
                type="button"
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
