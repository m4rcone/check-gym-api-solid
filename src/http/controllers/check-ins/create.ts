import z from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";
import { errorHandlerResponse } from "@/infra/controller";

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((latitude) => {
      return Math.abs(latitude) <= 90;
    }),
    longitude: z.number().refine((latitude) => {
      return Math.abs(latitude) <= 180;
    }),
  });

  const { latitude, longitude } = createCheckInBodySchema.parse(req.body);
  const { gymId } = createCheckInParamsSchema.parse(req.params);

  const checkInUseCase = makeCheckInUseCase();

  let newCheckIn;

  try {
    newCheckIn = await checkInUseCase.execute({
      userId: req.user.sub,
      gymId,
      latitude,
      longitude,
    });
  } catch (error) {
    return errorHandlerResponse(error, res);
  }

  return res.status(201).send(newCheckIn);
}
