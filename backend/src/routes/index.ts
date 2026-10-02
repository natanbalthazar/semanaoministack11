import { Router } from "express";
import { OngController } from "../controllers/OngController";
import { IncidentController } from "../controllers/IncidentController";
import { ProfileController } from "../controllers/ProfileController";
import { SessionController } from "../controllers/SessionController";
import {
  createOngSchema,
  createSessionSchema,
  createIncidentSchema,
  queryIncidentsSchema,
  paramsIncidentSchema,
  authorizationHeaderSchema,
} from "../validations/schemas";
import { validate } from "../validations/middleware";

// Para desacoplar o módulo de rotas do Express em uma nova variável
const routes = Router();

/*
 * Cada rota encadeia: validate(...) → controller. Se a validação falhar, responde 400
 * e o controller nem roda. A ordem importa: em POST /incidents o header é checado antes do body.
 *
 * Atenção: DELETE /incidents/:id não valida o header `Authorization` aqui. Sem ele o controller
 * responde 401 (e não 400) porque compara o dono do caso com `undefined`.
 * Mantido assim para não mudar o contrato que o frontend e o mobile já usam.
 */

routes.post(
  "/sessions",
  validate(createSessionSchema, "body"),
  SessionController.create,
);

routes.get("/ongs", OngController.index);

routes.post(
  "/ongs",
  validate(createOngSchema, "body"),
  OngController.create,
);

routes.get(
  "/profile",
  validate(authorizationHeaderSchema, "headers"),
  ProfileController.index,
);

routes.get(
  "/incidents",
  validate(queryIncidentsSchema, "query"),
  IncidentController.index,
);

routes.post(
  "/incidents",
  validate(authorizationHeaderSchema, "headers"),
  validate(createIncidentSchema, "body"),
  IncidentController.create,
);

routes.delete(
  "/incidents/:id",
  validate(paramsIncidentSchema, "params"),
  IncidentController.delete,
);

export { routes };
