import { z } from "zod";

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
  value: z
    .string()
    .transform((v) => parseFloat(v.replace(",", ".")))
    .refine((v) => !isNaN(v) && v >= 1, "Valor deve ser maior que 0"),
});

export type LogonInput = z.infer<typeof logonSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type IncidentInput = z.output<typeof incidentSchema>;

