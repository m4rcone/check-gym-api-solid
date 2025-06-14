import { Gym, Prisma } from "generated/prisma";

export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>;
  findOneById(gymId: string): Promise<Gym | null>;
  findManyByQuery(query: string, page: number): Promise<Gym[]>;
  findManyNearby(userLatitude: number, userLongitude: number): Promise<Gym[]>;
}
