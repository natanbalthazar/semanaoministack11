import { z } from "zod";

export const logonSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  whatsapp: z.string().min(10, "WhatsApp inválido").max(11, "WhatsApp inválido"),
  city: z.string().min(1, "Cidade é obrigatória"),
  uf: z.string().length(2, "UF deve ter 2 caracteres"),
});

export const incidentSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  value: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === "string" ? parseFloat(v.replace(",", ".")) : v))
    .refine((v) => !isNaN(v) && v >= 1, "Valor deve ser maior que 0"),
});

export type LogonInput = z.infer<typeof logonSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type IncidentInput = z.infer<typeof incidentSchema>;

// Tipo para o formulário de incidente (valor vem como string do input)
export type IncidentFormInput = {
  title: string;
  description: string;
  value: string;
};
