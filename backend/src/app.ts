import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";
import { routes } from "./routes";
import { generateOpenAPIDocument } from "./validations/schemas";

const app = express();

// Sem opções, o cors() libera QUALQUER origem a chamar a API. Ok para estudo/desenvolvimento;
// em produção, restrinja: cors({ origin: "https://seu-front.com" }).
app.use(cors());

// Converte o corpo JSON em `request.body`. Precisa vir ANTES das rotas: se vier depois,
// os controllers recebem `request.body` undefined e a validação responde 400 para tudo.
app.use(express.json());

app.use(routes);

// Swagger UI - documentação interativa em /api-docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(generateOpenAPIDocument(), {
    customSiteTitle: "API Be The Hero - Documentação",
  }),
);

/**
 * Tratador de erros: o Express reconhece pelos 4 parâmetros (não remova o `_next`, mesmo sem uso).
 *
 * - JSON malformado no corpo (ex.: `{bad json`) → o express.json() gera erro com status 400 → 400.
 * - Qualquer outro erro → 500 genérico, sem vazar detalhes internos (o detalhe vai para o console).
 *   No Express 5, erros lançados dentro de controllers `async` (ex.: falha no banco) chegam aqui
 *   sozinhos; no Express 4 eles derrubavam o processo.
 */
app.use(
  (
    err: Error & { status?: number },
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    if (err.status === 400) {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  },
);

export default app;
