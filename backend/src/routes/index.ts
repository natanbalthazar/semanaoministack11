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
} from "../validations/schemas";
import { validate } from "../validations/middleware";
import { ensureAuthenticated, rateLimit } from "../auth/middleware";

// Para desacoplar o módulo de rotas do Express em uma nova variável
const routes = Router();

/*
 * Cada rota encadeia middlewares → controller. Se um deles responder (400, 401, 429), o resto nem roda.
 * Nas rotas protegidas o `ensureAuthenticated` vem PRIMEIRO: sem token válido → 401, antes de
 * validar body/params (não faz sentido dizer a um anônimo que o corpo está errado).
 */

routes.post(
  "/sessions",
  rateLimit(10, 60_000), // 10 tentativas de login por IP por minuto
  validate(createSessionSchema, "body"),
  SessionController.create,
);

routes.get("/ongs", OngController.index);

routes.post(
  "/ongs",
  validate(createOngSchema, "body"),
  OngController.create,
);

routes.get("/profile", ensureAuthenticated, ProfileController.index);

routes.get(
  "/incidents",
  validate(queryIncidentsSchema, "query"),
  IncidentController.index,
);

routes.post(
  "/incidents",
  ensureAuthenticated,
  validate(createIncidentSchema, "body"),
  IncidentController.create,
);

routes.delete(
  "/incidents/:id",
  ensureAuthenticated,
  validate(paramsIncidentSchema, "params"),
  IncidentController.delete,
);

export { routes };
