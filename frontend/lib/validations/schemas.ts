import { z } from "zod";

/**
 * Schemas zod: a mesma regra serve para validar E para tipar o formulário.
 *
 * Com `useForm({ resolver: zodResolver(schema) })`, o react-hook-form roda o schema a cada
 * submit. Se algum campo falhar → `formState.errors.<campo>.message` recebe a mensagem abaixo
 * e o `onSubmit` NÃO é chamado. Se passar → o `onSubmit` recebe os dados JÁ transformados
 * (ex.: `value` vira number), com o tipo inferido do schema — sem precisar escrever tipos à mão.
 *
 * Isto é só a experiência do usuário: o backend valida de novo. Nunca confie apenas
 * na validação do navegador (ela pode ser burlada com qualquer cliente HTTP).
 */

export const logonSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.email("Email inválido"),
  whatsapp: z.string().min(10, "WhatsApp inválido").max(11, "WhatsApp inválido"),
  city: z.string().min(1, "Cidade é obrigatória"),
  uf: z.string().length(2, "UF deve ter 2 caracteres"),
});

export const incidentSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  // O input entrega texto; aceitamos vírgula ("10,50") e enviamos number para a API.
  // Texto inválido vira NaN, e `NaN >= 1` é false → cai na mensagem de erro.
  value: z
    .string()
    .transform((v) => parseFloat(v.replace(",", ".")))
    .refine((v) => v >= 1, "Valor deve ser maior que 0"),
});
