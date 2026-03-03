import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type ValidateSource = "body" | "query" | "params" | "headers";

export function validate(schema: ZodSchema, source: ValidateSource = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = req[source];
      const parsed = schema.parse(data);
      Object.assign(req[source] as object, parsed as object);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next({
          status: 400,
          message: "Validation failed",
          details: error.errors,
        });
      }
      next(error);
    }
  };
}
