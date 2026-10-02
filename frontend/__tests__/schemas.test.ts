import { describe, it, expect } from "vitest";
import { incidentSchema } from "@/lib/validations/schemas";

const base = { title: "Caso", description: "Descrição" };

describe("incidentSchema", () => {
  it("converte o valor digitado (com vírgula ou ponto) para number", () => {
    expect(incidentSchema.parse({ ...base, value: "10,50" }).value).toBe(10.5);
    expect(incidentSchema.parse({ ...base, value: "150" }).value).toBe(150);
  });

  it("rejeita valor vazio, inválido ou menor que 1", () => {
    for (const value of ["", "abc", "0.5"]) {
      expect(incidentSchema.safeParse({ ...base, value }).success).toBe(false);
    }
  });
});
