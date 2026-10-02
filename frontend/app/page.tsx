"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiLogIn } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiPost } from "@/lib/api";
import { logonSchema } from "@/lib/validations/schemas";
import { useAuth } from "@/hooks/useAuth";
import { FieldError } from "@/components/FieldError";

// "use client" é obrigatório aqui: a página usa hooks (useForm, useRouter...) e eventos.
// Sem ele, o Next trata o arquivo como Server Component e o build falha ao usar hooks.
export default function LogonPage() {
  const router = useRouter();
  const { setAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(logonSchema), defaultValues: { id: "" } });

  // useMutation guarda o estado da requisição (isPending, isError) para nós.
  const logon = useMutation({
    mutationFn: (data: { id: string }) => apiPost<{ name: string }>("sessions", data),
    onSuccess: ({ name }, { id }) => {
      setAuth(id, name);
      router.push("/profile");
    },
  });

  return (
    <div className="w-full max-w-[1120px] min-h-screen mx-auto flex items-center justify-between">
      <section className="w-full max-w-[350px] mr-8">
        <Image src="/logo.svg" alt="Be The Hero" width={250} height={106} preload />
        <form onSubmit={handleSubmit((data) => logon.mutate(data))} className="mt-[100px]">
          <h1 className="text-3xl font-bold mb-8">Faça seu logon</h1>

          <input
            type="text"
            placeholder="Sua ID"
            aria-label="Sua ID"
            className="form-input"
            {...register("id")}
          />
          <FieldError message={errors.id?.message} className="mt-1" />
          <FieldError message={logon.isError ? "Falha no login, tente novamente." : undefined} className="mt-2" />

          <button type="submit" className="btn-primary" disabled={logon.isPending}>
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
        height={482}
        className="hidden md:block"
      />
    </div>
  );
}
