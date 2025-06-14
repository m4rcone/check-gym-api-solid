import { UnauthorizedError } from "@/infra/errors";
import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWT(req: FastifyRequest, res: FastifyReply) {
  try {
    await req.jwtVerify();
    // eslint-disable-next-line
  } catch (error: any) {
    const unauthorizedError = new UnauthorizedError({
      cause: error,
    });
    return res
      .status(unauthorizedError.statusCode)
      .send(unauthorizedError.toJSON());
  }
}
