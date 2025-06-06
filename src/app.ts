import fastify from "fastify";
import { routes } from "./http/routes";
import { errorHandlerResponse } from "./infra/controller";
import { ZodError } from "zod";
import { ValidationError } from "./infra/errors";

export const app = fastify();

app.register(routes);

app.setErrorHandler((error, _req, res) => {
  if (error instanceof ZodError) {
    const validationError = new ValidationError({});

    return errorHandlerResponse(validationError, res);
  }

  return errorHandlerResponse(error, res);
});
