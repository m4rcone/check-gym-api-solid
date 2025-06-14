import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface GetUserMetricsUseCaseRequest {
  userId: string;
}

export class GetUserMetricsUseCase {
  private checkInsRepository;

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository;
  }

  async execute({ userId }: GetUserMetricsUseCaseRequest): Promise<number> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId);

    return checkInsCount;
  }
}
