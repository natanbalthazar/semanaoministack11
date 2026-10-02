import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";
import { routes } from "./routes";
import { generateOpenAPIDocument } from "./validations/schemas";

const app = express();

/*
 * CORS: quais SITES (origens) o navegador deixa ler as respostas da API.
 * `CORS_ORIGIN` = lista separada por vírgula. Padrão: Next dev (3000) + Expo web (8081).
 *
 * - Origem na lista → resposta vem com `Access-Control-Allow-Origin` e o navegador libera.
 * - Origem fora da lista → a API até responde, mas sem esse header; o navegador bloqueia o JS
 *   de ler a resposta ("blocked by CORS policy"). Front em outra porta/domínio? Adicione aqui.
 * - Sem header Origin (curl, app nativo, servidor) → passa normal.
 *
 * CORS NÃO é segurança da API: é uma regra do NAVEGADOR para proteger o usuário de sites
 * maliciosos. curl, Postman ou um script ignoram CORS. Quem protege os dados é o token.
 *
 * `exposedHeaders`: por padrão o navegador esconde do JS os headers customizados de respostas
 * de outra origem. Sem isso, o app web leria `X-Total-Count` como null ("Total de 0 casos").
 */
const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:3000,http://localhost:8081")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins, exposedHeaders: ["X-Total-Count"] }));

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
