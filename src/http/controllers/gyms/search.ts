import z from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";

export async function search(req: FastifyRequest, res: FastifyReply) {
  const searchGymsBodySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = searchGymsBodySchema.parse(req.query);

  const searchGymsUseCase = makeSearchGymsUseCase();

  const gymsFound = await searchGymsUseCase.execute({
    query,
    page,
  });

  return res.status(200).send(gymsFound);
}
