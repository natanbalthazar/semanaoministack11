"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiPost } from "@/lib/api";
import {
  incidentSchema,
  type IncidentFormInput,
  type IncidentInput,
} from "@/lib/validations/schemas";
import { useAuth } from "@/hooks/useAuth";

export default function NewIncidentPage() {
  const [error, setError] = useState("");
  const { ongId } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IncidentFormInput>({
    resolver: zodResolver(incidentSchema),
    defaultValues: { title: "", description: "", value: "" },
  });

  useEffect(() => {
    if (!ongId) {
      router.replace("/");
    }
  }, [ongId, router]);

  async function onSubmit(data: IncidentFormInput) {
    if (!ongId) return;
    setError("");
    // Schema valida e transforma value para number
    const value =
      typeof data.value === "string"
        ? parseFloat(data.value.replace(",", ".")) || 0
        : data.value;
    const payload: IncidentInput = { ...data, value };
    try {
      await apiPost("incidents", payload, {
        Authorization: ongId,
      });
      router.push("/profile");
    } catch {
      setError("Erro ao cadastrar caso, tente novamente.");
    }
  }

  if (!ongId) return null;

  return (
    <div className="w-full max-w-[1120px] min-h-screen mx-auto flex items-center justify-center">
      <div className="w-full p-24 bg-gray-soft shadow-[0_0_100px_rgba(0,0,0,0.1)] rounded-lg flex justify-between items-center">
        <section className="w-full max-w-[380px]">
          <Image
            src="/logo.svg"
            alt="Be The Hero"
            width={250}
            height={106}
            priority
          />
          <h1 className="mt-16 mb-8 text-3xl font-bold">Cadastrar novo caso</h1>
          <p className="text-lg text-gray-text leading-8">
            Descreva o caso detalhadamente para encontrar um herói para resolver
            isso.
          </p>
          <Link href="/profile" className="back-link">
            <FiArrowLeft size={16} color="#E02041" />
            Voltar para home
          </Link>
        </section>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[450px] space-y-2"
        >
          <input
            placeholder="Título do caso"
            className="form-input"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}

          <textarea
            placeholder="Descrição"
            className="form-textarea"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}

          <input
            placeholder="Valor em reais"
            title="Caso deseje colocar centavos, use .(ponto) ao invés da ,(vírgula). Por exemplo, 10.11."
            className="form-input"
            {...register("value")}
          />
          {errors.value && (
            <p className="text-red-500 text-sm">{errors.value.message}</p>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
