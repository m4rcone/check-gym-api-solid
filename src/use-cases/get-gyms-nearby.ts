import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "generated/prisma";

interface GetGymsNearbyUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

export class GetGymsNearbyUseCase {
  private gymsRepository;

  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository;
  }

  async execute({
    userLatitude,
    userLongitude,
  }: GetGymsNearbyUseCaseRequest): Promise<Gym[]> {
    const gymsNearby = await this.gymsRepository.findManyNearby(
      userLatitude,
      userLongitude
    );

    return gymsNearby;
  }
}
