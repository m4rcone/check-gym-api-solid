import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "generated/prisma";

interface GetUserHistoryUseCaseRequest {
  userId: string;
  page: number;
}

export class GetUserHistoryUseCase {
  private checkInsRepository;

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository;
  }

  async execute({
    userId,
    page,
  }: GetUserHistoryUseCaseRequest): Promise<CheckIn[] | []> {
    const checkInsFound = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    );

    if (!checkInsFound) {
      return [];
    }

    return checkInsFound;
  }
}
