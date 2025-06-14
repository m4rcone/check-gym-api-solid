import z from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    latitude: z.number().refine((latitude) => {
      return Math.abs(latitude) <= 90;
    }),
    longitude: z.number().refine((latitude) => {
      return Math.abs(latitude) <= 180;
    }),
  });

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(req.body);

  const createGymUseCase = makeCreateGymUseCase();

  const newGym = await createGymUseCase.execute({
    title,
    description: description ?? null,
    phone: phone ?? null,
    latitude,
    longitude,
  });

  return res.status(201).send(newGym);
}
