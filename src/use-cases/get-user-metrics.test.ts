import { describe, test, expect } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { randomUUID } from "node:crypto";
import { GetUserMetricsUseCase } from "./get-user-metrics";

describe("Get User Metrics Use Case", () => {
  test("Should be able to get a check-ins metrics", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const checkInsRepository = new InMemoryCheckInsRepository();
    const getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository);

    const newUser = await usersRepository.create({
      name: "Nome do Usuário",
      email: "user@email.com",
      password: "senhasegura",
    });

    await checkInsRepository.create({
      user_id: newUser.id,
      gym_id: randomUUID(),
    });

    await checkInsRepository.create({
      user_id: newUser.id,
      gym_id: randomUUID(),
    });

    const checkInsCount = await getUserMetricsUseCase.execute({
      userId: newUser.id,
    });

    expect(checkInsCount).toEqual(2);
  });
});
