import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { describe, expect, test } from "vitest";
import { GetGymsNearbyUseCase } from "./get-gyms-nearby";

describe("Get Gyms Nearby Use Case", () => {
  test("Should be able to get gyms neaby", async () => {
    const gymsRepository = new InMemoryGymsRepository();
    const getGymsNearbyUseCase = new GetGymsNearbyUseCase(gymsRepository);

    await gymsRepository.create({
      title: "Javascript Gym",
      latitude: -29.3400876,
      longitude: -49.7346734,
    });

    await gymsRepository.create({
      title: "TypeScript Gym",
      latitude: -29.3367547,
      longitude: -49.7356408,
    });

    const gymsNearby = await getGymsNearbyUseCase.execute({
      userLatitude: -29.3353892,
      userLongitude: -49.7292035,
    });

    expect(gymsNearby.length).toEqual(2);
  });

  test("Should not be able to get far away gyms", async () => {
    const gymsRepository = new InMemoryGymsRepository();
    const getGymsNearbyUseCase = new GetGymsNearbyUseCase(gymsRepository);

    await gymsRepository.create({
      title: "Javascript Gym",
      latitude: -29.3400876,
      longitude: -49.7346734,
    });

    // location far from the user
    await gymsRepository.create({
      title: "Far Away Gym",
      latitude: -29.15343267357609,
      longitude: -49.58526543922466,
    });

    const gymsNearby = await getGymsNearbyUseCase.execute({
      userLatitude: -29.3353892,
      userLongitude: -49.7292035,
    });

    expect(gymsNearby.length).toEqual(1);
  });
});
