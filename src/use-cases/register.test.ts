import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, test, expect } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { ValidationError } from "@/infra/errors";

describe("Register Use Case", () => {
  test("Should be able to register a user", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const newUser = await registerUseCase.execute({
      name: "Nome Usuário",
      email: "usuario@email.com",
      password: "senhasegura",
    });

    expect(newUser).toEqual({
      id: newUser.id,
      name: "Nome Usuário",
      email: "usuario@email.com",
      password: newUser.password,
      role: "Member",
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    });
  });

  test("Should not be able to register a user with duplicated email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    await registerUseCase.execute({
      name: "Nome Usuário",
      email: "emailduplicado@email.com",
      password: "senhasegura",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "Nome Usuário",
        email: "emailduplicado@email.com",
        password: "senhasegura",
      })
    ).rejects.toBeInstanceOf(ValidationError);
  });

  test("The password must be hashed", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const newUser = await registerUseCase.execute({
      name: "Nome Usuário",
      email: "usuario@email.com",
      password: "senhasegura",
    });

    const isCorrectPassword = await compare("senhasegura", newUser.password);

    expect(isCorrectPassword).toBe(true);
  });
});
