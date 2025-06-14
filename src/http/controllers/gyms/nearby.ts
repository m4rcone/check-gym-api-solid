import z from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetGymsNearbyUseCase } from "@/use-cases/factories/make-get-gyms-nearby-use-case";

export async function nearby(req: FastifyRequest, res: FastifyReply) {
  const nearbyGymBodySchema = z.object({
    latitude: z.coerce.number().refine((latitude) => {
      return Math.abs(latitude) <= 90;
    }),
    longitude: z.coerce.number().refine((longitude) => {
      return Math.abs(longitude) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyGymBodySchema.parse(req.query);

  const getGymsNearbyUseCase = makeGetGymsNearbyUseCase();

  const nearbyGyms = await getGymsNearbyUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return res.status(200).send(nearbyGyms);
}
