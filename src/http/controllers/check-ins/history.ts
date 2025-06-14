import z from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetUserHistoryUseCase } from "@/use-cases/factories/make-get-user-history-use-case";

export async function history(req: FastifyRequest, res: FastifyReply) {
  const userHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = userHistoryQuerySchema.parse(req.query);

  const getUserHistoryUseCase = makeGetUserHistoryUseCase();

  const checkInHistory = await getUserHistoryUseCase.execute({
    userId: req.user.sub,
    page,
  });

  return res.status(200).send(checkInHistory);
}
