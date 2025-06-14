import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, test, expect } from "vitest";
import { NotFoundError } from "@/infra/errors";
import { GetUserProfileUseCase } from "./get-user-profile";
import { randomUUID } from "crypto";

describe("Get User Profile Use Case", () => {
  test("Should be able to get a user profile by id", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);

    const createdUser = await usersRepository.create({
      name: "Nome Usuário",
      email: "usuario@email.com",
      password: "senhasegura",
    });

    const userFound = await getUserProfileUseCase.execute({
      userId: createdUser.id,
    });

    expect(userFound).toEqual({
      id: createdUser.id,
      name: "Nome Usuário",
      email: "usuario@email.com",
      role: "Member",
      password: createdUser.password,
      created_at: createdUser.created_at,
      updated_at: createdUser.updated_at,
    });
  });

  test("Should not be able to get a user profile with non-existent id", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);

    await expect(() =>
      getUserProfileUseCase.execute({
        userId: randomUUID(),
      })
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
