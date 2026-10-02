"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";
import { apiPost } from "@/lib/api";
import { incidentSchema } from "@/lib/validations/schemas";
import { FieldError } from "@/components/FieldError";
import { FormCard } from "@/components/FormCard";
import { RequireAuth } from "@/components/RequireAuth";

export default function NewIncidentPage() {
  return <RequireAuth>{({ ongId }) => <NewIncidentForm ongId={ongId} />}</RequireAuth>;
}

function NewIncidentForm({ ongId }: { ongId: string }) {
  const router = useRouter();

  // O resolver informa ao useForm os DOIS tipos do schema: o de entrada (value: string,
  // como vem do input) e o de saída (value: number), que é o que chega no handleSubmit.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(incidentSchema),
    defaultValues: { title: "", description: "", value: "" },
  });

  const createIncident = useMutation({
    mutationFn: (data: z.output<typeof incidentSchema>) =>
      apiPost("incidents", data, { Authorization: ongId }),
    onSuccess: () => router.push("/profile"),
  });

  return (
    <FormCard
      title="Cadastrar novo caso"
      description="Descreva o caso detalhadamente para encontrar um herói para resolver isso."
      backHref="/profile"
      backLabel="Voltar para home"
    >
      <form
        onSubmit={handleSubmit((data) => createIncident.mutate(data))}
        className="w-full max-w-[450px] space-y-2"
      >
        <input placeholder="Título do caso" aria-label="Título do caso" className="form-input" {...register("title")} />
        <FieldError message={errors.title?.message} />

        <textarea placeholder="Descrição" aria-label="Descrição" className="form-textarea" {...register("description")} />
        <FieldError message={errors.description?.message} />

        <input
          placeholder="Valor em reais"
          aria-label="Valor em reais"
          title="Caso deseje colocar centavos, use .(ponto) ao invés da ,(vírgula). Por exemplo, 10.11."
          className="form-input"
          {...register("value")}
        />
        <FieldError message={errors.value?.message} />

        <FieldError message={createIncident.isError ? "Erro ao cadastrar caso, tente novamente." : undefined} />

        <button type="submit" className="btn-primary mt-0" disabled={createIncident.isPending}>
          Cadastrar
        </button>
      </form>
    </FormCard>
  );
}
