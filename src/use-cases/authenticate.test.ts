import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, test, expect } from "vitest";
import { hash } from "bcryptjs";
import { AuthenticateUseCase } from "./authenticate";
import { env } from "@/env";
import { UnauthorizedError } from "@/infra/errors";

describe("Authenticate Use Case", () => {
  test("Should be able to authenticate a user", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    const newUser = await usersRepository.create({
      name: "Nome Usuário",
      email: "usuario@email.com",
      password: await hash(
        "senhasegura",
        env.NODE_ENV === "production" ? 14 : 1
      ),
    });

    const authenticateUser = await authenticateUseCase.execute({
      email: "usuario@email.com",
      password: "senhasegura",
    });

    expect(authenticateUser).toEqual({
      id: newUser.id,
      name: "Nome Usuário",
      email: "usuario@email.com",
      password: newUser.password,
      role: "Member",
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    });
  });

  test("Should not be able to authenticate a user with wrong email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "Nome Usuário",
      email: "emailcorreto@email.com",
      password: await hash(
        "senhasegura",
        env.NODE_ENV === "production" ? 14 : 1
      ),
    });

    await expect(() =>
      authenticateUseCase.execute({
        email: "emailerrado@email.com",
        password: "senhasegura",
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  test("Should not be able to authenticate a user with wrong password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "Nome Usuário",
      email: "usuario@email.com",
      password: await hash(
        "senhacorreta",
        env.NODE_ENV === "production" ? 14 : 1
      ),
    });

    await expect(() =>
      authenticateUseCase.execute({
        email: "usuario@email.com",
        password: "senhaincorreta",
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
