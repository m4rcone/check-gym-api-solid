import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { describe, expect, test } from "vitest";
import { CreateGymUseCase } from "./create-gym";

describe("Create Gym Use Case", () => {
  test("Should be able to create a gym.", async () => {
    const gymsRepository = new InMemoryGymsRepository();
    const createGymsUseCase = new CreateGymUseCase(gymsRepository);

    const createdGym = await createGymsUseCase.execute({
      title: "Nome Academia",
      description: "Descrição",
      phone: "(99)99999-9999",
      latitude: -29.3400876,
      longitude: -49.7346734,
    });

    expect(createdGym).toEqual({
      id: createdGym.id,
      title: "Nome Academia",
      description: "Descrição",
      phone: "(99)99999-9999",
      latitude: createdGym.latitude,
      longitude: createdGym.longitude,
      created_at: createdGym.created_at,
      updated_at: createdGym.updated_at,
    });
  });
});
