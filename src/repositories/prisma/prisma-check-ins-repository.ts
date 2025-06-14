import { prisma } from "@/infra/prisma";
import { type Prisma } from "generated/prisma";
import { CheckInsRepository } from "../check-ins-repository";

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const newCheckIn = await prisma.checkIn.create({
      data: {
        user_id: data.user_id,
        gym_id: data.gym_id,
      },
    });

    return newCheckIn;
  }

  async validate(id: string) {
    const validatedCheckIn = await prisma.checkIn.update({
      where: {
        id,
      },
      data: {
        validated_at: new Date(),
      },
    });

    return validatedCheckIn;
  }

  async findOneById(id: string) {
    const checkInFound = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });

    return checkInFound;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = new Date(date);
    const endOfTheDay = new Date(date);

    startOfTheDay.setHours(0, 0, 0, 0);
    endOfTheDay.setHours(23, 59, 59, 999);

    const checkInFound = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    });

    return checkInFound;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkInsFound = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return checkInsFound;
  }

  async countByUserId(userId: string) {
    const checkInsQtd = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    });

    return checkInsQtd;
  }
}
