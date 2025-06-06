import { FastifyReply } from "fastify";
import { InternalServerError, ValidationError } from "./errors";

// eslint-disable-next-line
export function errorHandlerResponse(error: Error | any, res: FastifyReply) {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).send(error.toJSON());
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  console.log(publicErrorObject);

  return res
    .status(publicErrorObject.statusCode)
    .send(publicErrorObject.toJSON());
}
