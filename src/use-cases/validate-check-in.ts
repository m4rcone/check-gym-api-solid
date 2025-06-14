import { NotFoundError, UnauthorizedError } from "@/infra/errors";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "generated/prisma";

interface ValidateCheckInUseCaseRequest {
  id: string;
}

export class ValidateCheckInUseCase {
  private checkInsRepository;

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository;
  }

  async execute({ id }: ValidateCheckInUseCaseRequest): Promise<CheckIn> {
    const MAX_TIME_CHECKIN_IN_MILLISECONDS = 1000 * 60 * 20; // 20 Minutes

    const checkInFound = await this.checkInsRepository.findOneById(id);

    if (!checkInFound) {
      throw new NotFoundError({});
    }

    const now = new Date();
    const diffInMilliseconds =
      now.getTime() - checkInFound.created_at.getTime();

    if (diffInMilliseconds > MAX_TIME_CHECKIN_IN_MILLISECONDS) {
      throw new UnauthorizedError({
        message:
          "Você só pode validar o check-in em até 20 minutos da criação.",
        action: "Você só pode criar e validar um novo check-in amanhã.",
      });
    }

    const validatedCheckIn = await this.checkInsRepository.validate(id);

    return validatedCheckIn;
  }
}
