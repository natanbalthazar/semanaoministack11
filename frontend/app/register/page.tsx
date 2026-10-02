"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";
import { apiPost } from "@/lib/api";
import { registerSchema } from "@/lib/validations/schemas";
import { FieldError } from "@/components/FieldError";
import { FormCard } from "@/components/FormCard";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", whatsapp: "", city: "", uf: "" },
  });

  const createOng = useMutation({
    mutationFn: (data: z.infer<typeof registerSchema>) => apiPost<{ id: string }>("ongs", data),
    onSuccess: ({ id }) => {
      // O ID gerado pelo backend é o "login" da ONG: precisa ser mostrado ao usuário.
      alert(`Seu ID de acesso: ${id}`);
      router.push("/");
    },
  });

  return (
    <FormCard
      title="Cadastro"
      description="Faça seu cadastro, entre na plataforma e ajude pessoas a encontrarem os casos da sua ONG."
      backHref="/"
      backLabel="Já possui cadastro"
    >
      <form
        onSubmit={handleSubmit((data) => createOng.mutate(data))}
        className="w-full max-w-[450px] space-y-2"
      >
        <input placeholder="Nome da ONG" aria-label="Nome da ONG" className="form-input" {...register("name")} />
        <FieldError message={errors.name?.message} />

        <input type="email" placeholder="E-mail" aria-label="E-mail" className="form-input" {...register("email")} />
        <FieldError message={errors.email?.message} />

        <input placeholder="WhatsApp" aria-label="WhatsApp" className="form-input" {...register("whatsapp")} />
        <FieldError message={errors.whatsapp?.message} />

        <div className="flex gap-2">
          <input placeholder="Cidade" aria-label="Cidade" className="form-input flex-1" {...register("city")} />
          <input placeholder="UF" aria-label="UF" className="form-input w-20" {...register("uf")} />
        </div>
        <FieldError message={errors.city?.message ?? errors.uf?.message} />

        <FieldError message={createOng.isError ? "Erro no cadastro, tente novamente." : undefined} />

        <button type="submit" className="btn-primary mt-0" disabled={createOng.isPending}>
          Cadastrar
        </button>
      </form>
    </FormCard>
  );
}
