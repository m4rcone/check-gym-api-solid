import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { GetGymsNearbyUseCase } from "../get-gyms-nearby";

export function makeGetGymsNearbyUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new GetGymsNearbyUseCase(gymsRepository);

  return useCase;
}
