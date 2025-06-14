import { type CheckIn, type Prisma } from "generated/prisma";
import { randomUUID } from "node:crypto";
import { CheckInsRepository } from "../check-ins-repository";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const newCheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    };

    this.checkIns.push(newCheckIn);

    return newCheckIn;
  }

  async validate(id: string) {
    const checkInIndex = this.checkIns.findIndex(
      (checkIn) => checkIn.id === id
    );

    this.checkIns[checkInIndex].validated_at = new Date();

    return this.checkIns[checkInIndex];
  }

  async findOneById(id: string) {
    const checkInFound = this.checkIns.find((checkIn) => checkIn.id === id);

    if (!checkInFound) {
      return null;
    }

    return checkInFound;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = new Date(date);
    const endOfTheDay = new Date(date);

    startOfTheDay.setHours(0, 0, 0, 0);
    endOfTheDay.setHours(59, 59, 59, 999);

    const checkInFound = this.checkIns.find((checkIn) => {
      return (
        checkIn.user_id === userId &&
        checkIn.created_at >= startOfTheDay &&
        checkIn.created_at <= endOfTheDay
      );
    });

    if (!checkInFound) {
      return null;
    }

    return checkInFound;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkInsFound = this.checkIns
      .filter((checkIn) => {
        return checkIn.user_id === userId;
      })
      .slice((page - 1) * 20, page * 20);

    return checkInsFound;
  }

  async countByUserId(userId: string) {
    const checkInsCount = this.checkIns.filter(
      (checkIn) => checkIn.user_id === userId
    ).length;

    return checkInsCount;
  }
}
