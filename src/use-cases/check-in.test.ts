import { describe, test, expect } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { randomUUID } from "node:crypto";
import { UnauthorizedError } from "@/infra/errors";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

describe("Check In Use Case", () => {
  test("Should be able to check in", async () => {
    const gymsRepository = new InMemoryGymsRepository();
    const checkInsRepository = new InMemoryCheckInsRepository();
    const checkInUseCase = new CheckInUseCase(
      checkInsRepository,
      gymsRepository
    );

    const newGym = await gymsRepository.create({
      title: "Javascript Gym",
      latitude: -29.3400876,
      longitude: -49.7346734,
    });

    const newCheckIn = await checkInUseCase.execute({
      userId: randomUUID(),
      gymId: newGym.id,
      latitude: -29.3400876,
      longitude: -49.7346734,
    });

    expect(newCheckIn).toEqual({
      id: newCheckIn.id,
      user_id: newCheckIn.user_id,
      gym_id: newCheckIn.gym_id,
      created_at: newCheckIn.created_at,
      validated_at: newCheckIn.validated_at,
    });
  });

  test("Should not be able for a user to check in twice in the same day.", async () => {
    const gymsRepository = new InMemoryGymsRepository();
    const checkInsRepository = new InMemoryCheckInsRepository();
    const checkInUseCase = new CheckInUseCase(
      checkInsRepository,
      gymsRepository
    );

    const newGym = await gymsRepository.create({
      title: "Javascript Gym",
      latitude: -29.3400876,
      longitude: -49.7346734,
    });

    const newCheckIn = await checkInUseCase.execute({
      userId: randomUUID(),
      gymId: newGym.id,
      latitude: -29.3400876,
      longitude: -49.7346734,
    });

    await expect(() =>
      checkInUseCase.execute({
        userId: newCheckIn.user_id,
        gymId: newGym.id,
        latitude: -29.3400876,
        longitude: -49.7346734,
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  test("Should not be able for a user to check in on distance gym.", async () => {
    const gymsRepository = new InMemoryGymsRepository();
    const checkInsRepository = new InMemoryCheckInsRepository();
    const checkInUseCase = new CheckInUseCase(
      checkInsRepository,
      gymsRepository
    );

    const newGym = await gymsRepository.create({
      title: "Javascript Gym",
      latitude: -29.3400876,
      longitude: -49.7346734,
    });

    await expect(() =>
      checkInUseCase.execute({
        userId: randomUUID(),
        gymId: newGym.id,
        // location far from the gym
        latitude: -29.3263757,
        longitude: -49.7220348,
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
