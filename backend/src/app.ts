import cors from "cors";
import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import swaggerUi from "swagger-ui-express";
import { routes } from "./routes";
import { generateOpenAPIDocument } from "./validations/schemas";

const app: Express = express();

// Como estamos em desenvolvimento, deixaremos apenas isso.
// Ao deixar apenas o comando acima, permitiremos que todas as aplicações Front-End possam acessar o Back-End.
app.use(cors());

app.use(express.json());

// Necessário que o comando abaixo seja após o comando acima (express.json)
app.use(routes);

// Swagger UI - documentação da API em /api-docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(generateOpenAPIDocument(), {
    customSiteTitle: "API Be The Hero - Documentação",
  }),
);

// Error handler para validação Zod
app.use(
  (
    err: Error & { status?: number; details?: unknown },
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    if (err.status === 400) {
      return res.status(400).json({
        message: err.message || "Validation failed",
        details: err.details,
      });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  },
);

export default app;
