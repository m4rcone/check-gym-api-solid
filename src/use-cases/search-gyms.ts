import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "generated/prisma";

interface SearchGymsUseCaseRequest {
  query: string;
  page: number;
}

export class SearchGymsUseCase {
  private gymsRepository;

  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository;
  }

  async execute({ query, page }: SearchGymsUseCaseRequest): Promise<Gym[]> {
    const gymsFound = await this.gymsRepository.findManyByQuery(query, page);

    return gymsFound;
  }
}
