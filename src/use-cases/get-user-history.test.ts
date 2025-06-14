import { describe, test, expect } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { GetUserHistoryUseCase } from "./get-user-history";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

describe("Get User History Use Case", () => {
  test("Should be able to get a check-ins history", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const gymsRepository = new InMemoryGymsRepository();
    const checkInsRepository = new InMemoryCheckInsRepository();
    const getUserHistoryUseCase = new GetUserHistoryUseCase(checkInsRepository);

    const newUser = await usersRepository.create({
      name: "Nome do Usuário",
      email: "user@email.com",
      password: "senhasegura",
    });

    const newGym = await gymsRepository.create({
      title: "Javascript Gym",
      latitude: -29.3400876,
      longitude: -49.7346734,
    });

    const newCheckIn1 = await checkInsRepository.create({
      user_id: newUser.id,
      gym_id: newGym.id,
    });

    const newCheckIn2 = await checkInsRepository.create({
      user_id: newUser.id,
      gym_id: newGym.id,
    });

    const userHistory = await getUserHistoryUseCase.execute({
      userId: newUser.id,
      page: 1,
    });

    expect(userHistory).toEqual([
      {
        id: newCheckIn1.id,
        created_at: newCheckIn1.created_at,
        validated_at: newCheckIn1.validated_at,
        user_id: newUser.id,
        gym_id: newGym.id,
      },
      {
        id: newCheckIn2.id,
        created_at: newCheckIn2.created_at,
        validated_at: newCheckIn2.validated_at,
        user_id: newUser.id,
        gym_id: newGym.id,
      },
    ]);
  });

  test("Should be able to get a check-ins history paginated", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const gymsRepository = new InMemoryGymsRepository();
    const checkInsRepository = new InMemoryCheckInsRepository();
    const getUserHistoryUseCase = new GetUserHistoryUseCase(checkInsRepository);

    const newUser = await usersRepository.create({
      name: "Nome do Usuário",
      email: "user@email.com",
      password: "senhasegura",
    });

    const newGym = await gymsRepository.create({
      title: "Javascript Gym",
      latitude: -29.3400876,
      longitude: -49.7346734,
    });

    // Create 22 check-ins
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        user_id: newUser.id,
        gym_id: newGym.id,
      });
    }

    const userHistory1 = await getUserHistoryUseCase.execute({
      userId: newUser.id,
      page: 1,
    });

    const userHistory2 = await getUserHistoryUseCase.execute({
      userId: newUser.id,
      page: 2,
    });

    expect(userHistory1?.length).toBe(20);
    expect(userHistory2?.length).toBe(2);
  });
});
