"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiPost } from "@/lib/api";
import { registerSchema, type RegisterInput } from "@/lib/validations/schemas";

// Função responsável por fazer o cadastro do usuário.
// Para validar se deu certo - try/catch
export default function RegisterPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      city: "",
      uf: "",
    },
  });

  async function onSubmit(data: RegisterInput) {
    setError("");
    try {
      const response = await apiPost<{ id: string }>("ongs", data);
      // Resposta ao usuário: mostrar o ID gerado
      alert(`Seu ID de acesso: ${response.id}`);
      router.push("/");
    } catch {
      setError("Erro no cadastro, tente novamente.");
    }
  }

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
          <h1 className="mt-16 mb-8 text-3xl font-bold">Cadastro</h1>
          <p className="text-lg text-gray-text leading-8">
            Faça seu cadastro, entre na plataforma e ajude pessoas a encontrarem
            os casos da sua ONG.
          </p>
          <Link href="/" className="back-link">
            <FiArrowLeft size={16} color="#E02041" />
            Já possui cadastro
          </Link>
        </section>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[450px] space-y-2"
        >
          <input
            placeholder="Nome da ONG"
            className="form-input"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          <input
            type="email"
            placeholder="E-mail"
            className="form-input"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <input
            placeholder="WhatsApp"
            className="form-input"
            {...register("whatsapp")}
          />
          {errors.whatsapp && (
            <p className="text-red-500 text-sm">{errors.whatsapp.message}</p>
          )}

          <div className="flex gap-2">
            <input
              placeholder="Cidade"
              className="form-input flex-1"
              {...register("city")}
            />
            <input
              placeholder="UF"
              className="form-input w-20"
              {...register("uf")}
            />
          </div>
          {(errors.city || errors.uf) && (
            <p className="text-red-500 text-sm">
              {errors.city?.message ?? errors.uf?.message}
            </p>
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
