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

// Registry para documentação OpenAPI
const registry = new OpenAPIRegistry();

// Esquema de segurança "Bearer": no /api-docs aparece o botão "Authorize" para colar o token
// devolvido por POST /sessions. Rotas com `security: bearer` exigem `Authorization: Bearer <token>`.
// (O header não é validado por schema Zod: quem confere é o middleware `ensureAuthenticated`.)
const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});
const security = [{ [bearerAuth.name]: [] }];
const unauthorized = { description: "Token ausente, inválido ou expirado" };

// Registrar schemas
registry.register("CreateOng", createOngSchema);
registry.register("CreateSession", createSessionSchema);
registry.register("CreateIncident", createIncidentSchema);

// Registrar rotas no OpenAPI
registry.registerPath({
  method: "post",
  path: "/sessions",
  summary: "Login por ID da ONG (devolve o token de acesso)",
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
          schema: z.object({
            name: z.string(),
            token: z.string().openapi({ description: "JWT HS256, válido por 7 dias" }),
          }),
        },
      },
    },
    400: {
      description: "ONG não encontrada",
    },
    429: {
      description: "Muitas tentativas de login (limite por IP)",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/ongs",
  summary: "Lista todas as ONGs (sem o ID, que é a credencial de login)",
  responses: {
    200: {
      description: "Lista de ONGs",
      content: {
        "application/json": {
          schema: z.array(createOngSchema),
        },
      },
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
  security,
  responses: {
    200: {
      description: "Lista de incidentes da ONG",
    },
    401: unauthorized,
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
  security,
  request: {
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
    401: unauthorized,
  },
});

registry.registerPath({
  method: "delete",
  path: "/incidents/{id}",
  summary: "Remove incidente",
  security,
  request: {
    params: paramsIncidentSchema,
  },
  responses: {
    204: {
      description: "Incidente removido",
    },
    401: unauthorized,
    403: {
      description: "O incidente é de outra ONG",
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
