import { NotFoundError, UnauthorizedError } from "@/infra/errors";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "generated/prisma";
import { getDistanceBetweenCoordinates } from "./utils/getDistanceBetweenCoordinates";
import { GymsRepository } from "@/repositories/gyms-repository";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  latitude: number | string;
  longitude: number | string;
}

export class CheckInUseCase {
  private checkInsRepository;
  private gymsRepository;

  constructor(
    checkInsRepository: CheckInsRepository,
    gymsRepository: GymsRepository
  ) {
    this.checkInsRepository = checkInsRepository;
    this.gymsRepository = gymsRepository;
  }

  async execute({
    userId,
    gymId,
    latitude,
    longitude,
  }: CheckInUseCaseRequest): Promise<CheckIn> {
    const MAX_DISTANCE_IN_KM = 0.1; // 100 Meters

    const currentDate = new Date();
    const checkInFound = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      currentDate
    );

    if (checkInFound) {
      throw new UnauthorizedError({
        message: "Já foi realizado um check-in por este usuário hoje.",
        action: "Você só pode realizar um novo check-in amanhã.",
      });
    }

    const gymFound = await this.gymsRepository.findOneById(gymId);

    if (!gymFound) {
      throw new NotFoundError({});
    }

    const distanceBetweenCheckInAndGym = getDistanceBetweenCoordinates(
      { latitude: Number(latitude), longitude: Number(longitude) },
      {
        latitude: Number(gymFound.latitude),
        longitude: Number(gymFound.longitude),
      }
    );

    if (distanceBetweenCheckInAndGym > MAX_DISTANCE_IN_KM) {
      throw new UnauthorizedError({
        message: "Distante demais da academia para o check-in.",
        action: `Você precisa estar a no máximo ${MAX_DISTANCE_IN_KM} km da academia para realizar o check-in.`,
      });
    }

    const newCheckIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return newCheckIn;
  }
}
