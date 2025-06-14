import { Prisma, type Gym } from "generated/prisma";
import { randomUUID } from "node:crypto";
import { GymsRepository } from "../gyms-repository";
import { getDistanceBetweenCoordinates } from "@/use-cases/utils/getDistanceBetweenCoordinates";

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async create(data: Prisma.GymCreateInput) {
    const newGym = {
      id: randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(Number(data.latitude)),
      longitude: new Prisma.Decimal(Number(data.longitude)),
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.gyms.push(newGym);

    return newGym;
  }

  async findOneById(gymId: string) {
    const gymFound = this.gyms.find((gym) => gym.id === gymId);

    if (!gymFound) {
      return null;
    }

    return gymFound;
  }

  async findManyByQuery(query: string, page: number) {
    const gymsFound = this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20);

    return gymsFound;
  }

  async findManyNearby(userLatitude: number, userLongitude: number) {
    const gymsNearby = this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: userLatitude, longitude: userLongitude },
        {
          latitude: Number(gym.latitude),
          longitude: Number(gym.longitude),
        }
      );

      if (distance <= 10) {
        return gym;
      }
    });

    return gymsNearby;
  }
}
