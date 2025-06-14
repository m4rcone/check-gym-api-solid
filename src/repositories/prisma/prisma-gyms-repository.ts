import { Prisma } from "generated/prisma";
import { GymsRepository } from "../gyms-repository";
import { prisma } from "@/infra/prisma";
import { getGymsNearby } from "generated/prisma/sql";

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const newGym = await prisma.gym.create({
      data,
    });

    return newGym;
  }

  async findOneById(gymId: string) {
    const gymFound = await prisma.gym.findUnique({
      where: {
        id: gymId,
      },
    });

    return gymFound;
  }

  async findManyByQuery(query: string, page: number) {
    const gymsFound = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return gymsFound;
  }

  async findManyNearby(userLatitude: number, userLongitude: number) {
    const gymsFound = await prisma.$queryRawTyped(
      getGymsNearby(userLatitude, userLongitude)
    );

    return gymsFound;
  }
}
