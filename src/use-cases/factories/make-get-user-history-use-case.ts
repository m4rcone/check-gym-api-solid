import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { GetUserHistoryUseCase } from "../get-user-history";

export function makeGetUserHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new GetUserHistoryUseCase(checkInsRepository);

  return useCase;
}
