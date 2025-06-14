import fastify from "fastify";
import cookie from "@fastify/cookie";
import { userRoutes } from "./http/controllers/users/routes";
import { errorHandlerResponse } from "./infra/controller";
import { ZodError } from "zod";
import { ValidationError } from "./infra/errors";
import fastifyJwt from "@fastify/jwt";
import { env } from "./env";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refresh_token",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(cookie);

app.register(userRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _req, res) => {
  if (error instanceof ZodError) {
    const validationError = new ValidationError({});

    return errorHandlerResponse(validationError, res);
  }

  return errorHandlerResponse(error, res);
});
