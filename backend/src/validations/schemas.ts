import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Adiciona `.openapi()` aos schemas Zod. Sem isso, `registry.register(...)` abaixo lança
// "zodSchema.openapi is not a function" ao subir o servidor.
extendZodWithOpenApi(z);

/*
 * Os mesmos schemas Zod servem para duas coisas:
 * 1. validar a requisição (via `validate()` em routes/index.ts) e
 * 2. gerar a documentação OpenAPI exibida em /api-docs.
 * Mudou uma regra aqui? A validação e a documentação mudam juntas, sem duplicar nada.
 */
export const createOngSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.email("Email inválido"),
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
  value: z.number().min(1, "Valor deve ser no mínimo 1"),
});

// `z.coerce`: query string e params de URL sempre chegam como texto ("2"); coerce converte
// para número antes de validar. `?page=abc` → NaN → 400.
export const queryIncidentsSchema = z.object({
  page: z.coerce.number().optional(),
});

export const paramsIncidentSchema = z.object({
  id: z.coerce.number(),
});

// Rotas "autenticadas" recebem o ID da ONG no header `Authorization` (sem token/senha).
// Sem o header → 400. `looseObject` aceita os demais headers (host, content-type...) sem reclamar.
export const authorizationHeaderSchema = z.looseObject({
  authorization: z.string().min(1, "Authorization é obrigatório"),
});

// Registry para documentação OpenAPI
const registry = new OpenAPIRegistry();

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
    params: paramsIncidentSchema,
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

export function generateOpenAPIDocument() {
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
