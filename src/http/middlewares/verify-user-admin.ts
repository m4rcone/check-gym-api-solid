import { UnauthorizedError } from "@/infra/errors";
import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyUserAdmin(req: FastifyRequest, res: FastifyReply) {
  const { role } = req.user;

  if (role !== "Admin") {
    const unauthorizedError = new UnauthorizedError({
      message: "Recurso não autorizado.",
      action: "O usuário precisa ser admin.",
    });

    return res
      .status(unauthorizedError.statusCode)
      .send(unauthorizedError.toJSON());
  }
}
