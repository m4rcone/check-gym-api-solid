import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, test, expect } from "vitest";
import { CreateUserUseCase } from "./create-user";
import { compare } from "bcryptjs";
import { ValidationError } from "@/infra/errors";

describe("Create User Use Case", () => {
  test("Should be able to create a user", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const createUserUseCase = new CreateUserUseCase(usersRepository);

    const newUser = await createUserUseCase.execute({
      name: "Nome Usuário",
      email: "usuario@email.com",
      password: "senhasegura",
    });

    expect(newUser).toEqual({
      id: newUser.id,
      name: "Nome Usuário",
      email: "usuario@email.com",
      password: newUser.password,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    });
  });

  test("Shold not be able to create a user with duplicated email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const createUserUseCase = new CreateUserUseCase(usersRepository);

    await createUserUseCase.execute({
      name: "Nome Usuário",
      email: "usuario@email.com",
      password: "senhasegura",
    });

    await expect(async () =>
      createUserUseCase.execute({
        name: "Nome Usuário",
        email: "usuario@email.com",
        password: "senhasegura",
      })
    ).rejects.toBeInstanceOf(ValidationError);
  });

  test("The password must be hashed", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const createUserUseCase = new CreateUserUseCase(usersRepository);

    const newUser = await createUserUseCase.execute({
      name: "Nome Usuário",
      email: "usuario@email.com",
      password: "senhasegura",
    });

    const isCorrectPassword = await compare("senhasegura", newUser.password);

    expect(isCorrectPassword).toBe(true);
  });
});
