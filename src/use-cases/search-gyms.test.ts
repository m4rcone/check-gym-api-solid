import { describe, test, expect } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

describe("Search Gyms Use Case", () => {
  test("Should be able to search gyms", async () => {
    const gymsRepository = new InMemoryGymsRepository();
    const searchGymsUseCase = new SearchGymsUseCase(gymsRepository);

    const newGym1 = await gymsRepository.create({
      title: "Javascript Gym",
      latitude: -29.3400876,
      longitude: -49.7346734,
    });

    await gymsRepository.create({
      title: "Typescript Gym",
      latitude: -29.3400876,
      longitude: -49.7346734,
    });

    const gymsFound = await searchGymsUseCase.execute({
      query: "Javascript",
      page: 1,
    });
    expect(gymsFound).toEqual([
      {
        id: newGym1.id,
        title: "Javascript Gym",
        description: null,
        phone: null,
        latitude: newGym1.latitude,
        longitude: newGym1.longitude,
        created_at: newGym1.created_at,
        updated_at: newGym1.updated_at,
      },
    ]);
  });

  test("Should be able to search gyms with result paginated", async () => {
    const gymsRepository = new InMemoryGymsRepository();
    const searchGymsUseCase = new SearchGymsUseCase(gymsRepository);
    // Create 22 gyms
    for (let i = 1; i <= 22; i++) {
      gymsRepository.create({
        title: `Typescript Gym ${i}`,
        latitude: -29.3400876,
        longitude: -49.7346734,
      });
    }

    const gymsFoundPage1 = await searchGymsUseCase.execute({
      query: "Typescript",
      page: 1,
    });

    const gymsFoundPage2 = await searchGymsUseCase.execute({
      query: "22",
      page: 1,
    });

    expect(gymsFoundPage1?.length).toBe(20);
    expect(gymsFoundPage2?.length).toBe(1);
  });
});
