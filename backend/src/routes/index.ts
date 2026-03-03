import { Router, type IRouter } from "express";
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
const routes: IRouter = Router();

routes.post(
  "/sessions",
  validate(createSessionSchema, "body"),
  SessionController.create.bind(SessionController),
);

routes.get("/ongs", OngController.index.bind(OngController));

routes.post(
  "/ongs",
  validate(createOngSchema, "body"),
  OngController.create.bind(OngController),
);

routes.get(
  "/profile",
  validate(authorizationHeaderSchema, "headers"),
  ProfileController.index.bind(ProfileController),
);

routes.get(
  "/incidents",
  validate(queryIncidentsSchema, "query"),
  IncidentController.index.bind(IncidentController),
);

routes.post(
  "/incidents",
  validate(authorizationHeaderSchema, "headers"),
  validate(createIncidentSchema, "body"),
  IncidentController.create.bind(IncidentController),
);

routes.delete(
  "/incidents/:id",
  validate(paramsIncidentSchema, "params"),
  IncidentController.delete.bind(IncidentController),
);

// Para exportar as rotas
export { routes };
