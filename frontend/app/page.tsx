"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiLogIn } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiPost } from "@/lib/api";
import { logonSchema, type LogonInput } from "@/lib/validations/schemas";
import { useAuth } from "@/hooks/useAuth";

export default function LogonPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { setAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LogonInput>({
    resolver: zodResolver(logonSchema),
    defaultValues: { id: "" },
  });

  async function onSubmit(data: LogonInput) {
    setError("");
    try {
      const response = await apiPost<{ name: string }>("sessions", data);
      setAuth(data.id, response.name);
      router.push("/profile");
    } catch {
      setError("Falha no login, tente novamente.");
    }
  }

  return (
    <div className="w-full max-w-[1120px] min-h-screen mx-auto flex items-center justify-between">
      <section className="w-full max-w-[350px] mr-8">
        <Image
          src="/logo.svg"
          alt="Be The Hero"
          width={250}
          height={106}
          priority
        />
        <form onSubmit={handleSubmit(onSubmit)} className="mt-[100px]">
          <h1 className="text-3xl font-bold mb-8">Faça seu logon</h1>

          <input
            type="text"
            placeholder="Sua ID"
            className="form-input"
            {...register("id")}
          />
          {errors.id && (
            <p className="text-red-500 text-sm mt-1">{errors.id.message}</p>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            Entrar
          </button>

          <Link href="/register" className="back-link">
            <FiLogIn size={16} color="#E02041" />
            Não tenho cadastro
          </Link>
        </form>
      </section>
      <Image
        src="/heroes.png"
        alt="Heroes"
        width={500}
        height={500}
        className="hidden md:block"
      />
    </div>
  );
}
