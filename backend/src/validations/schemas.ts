import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// Schemas para validação e documentação OpenAPI
export const createOngSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  whatsapp: z.string().min(10).max(11),
  city: z.string().min(1, "Cidade é obrigatória"),
  uf: z.string().length(2, "UF deve ter 2 caracteres"),
});

export const createSessionSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

export const createIncidentSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  value: z.number().min(1, "Valor deve ser maior que 0"),
});

export const queryIncidentsSchema = z.object({
  page: z.coerce.number().optional(),
});

export const paramsIncidentSchema = z.object({
  id: z.coerce.number(),
});

export const authorizationHeaderSchema = z
  .object({
    authorization: z.string().min(1, "Authorization é obrigatório"),
  })
  .passthrough();

// Registry para documentação OpenAPI
export const registry = new OpenAPIRegistry();

// Registrar schemas
registry.register("CreateOng", createOngSchema);
registry.register("CreateSession", createSessionSchema);
registry.register("CreateIncident", createIncidentSchema);

// Registrar rotas no OpenAPI
registry.registerPath({
  method: "post",
  path: "/sessions",
  summary: "Login por ID da ONG",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createSessionSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "ONG encontrada",
      content: {
        "application/json": {
          schema: z.object({ name: z.string() }),
        },
      },
    },
    400: {
      description: "ONG não encontrada",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/ongs",
  summary: "Lista todas as ONGs",
  responses: {
    200: {
      description: "Lista de ONGs",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/ongs",
  summary: "Cadastra nova ONG",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createOngSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "ONG cadastrada",
      content: {
        "application/json": {
          schema: z.object({ id: z.string() }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/profile",
  summary: "Lista incidentes da ONG autenticada",
  request: {
    headers: authorizationHeaderSchema,
  },
  responses: {
    200: {
      description: "Lista de incidentes da ONG",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/incidents",
  summary: "Lista incidentes com paginação",
  request: {
    query: queryIncidentsSchema,
  },
  responses: {
    200: {
      description: "Lista de incidentes paginada",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/incidents",
  summary: "Cria novo incidente",
  request: {
    headers: authorizationHeaderSchema,
    body: {
      content: {
        "application/json": {
          schema: createIncidentSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Incidente criado",
      content: {
        "application/json": {
          schema: z.object({ id: z.number() }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/incidents/{id}",
  summary: "Remove incidente",
  request: {
    params: z.object({ id: z.coerce.number() }),
  },
  responses: {
    204: {
      description: "Incidente removido",
    },
    401: {
      description: "Operação não permitida",
    },
    404: {
      description: "Incidente não encontrado",
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export function generateOpenAPIDocument(): ReturnType<
  OpenApiGeneratorV3["generateDocument"]
> {
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "API Be The Hero - Semana O Ministack 11",
      description: "API para cadastro de ONGs e incidentes",
    },
    servers: [{ url: "http://localhost:3333", description: "Servidor local" }],
  });
}
