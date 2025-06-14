import { type Prisma, type User } from "generated/prisma";
import { UsersRepository } from "../users-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const newUser = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || "Member",
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.users.push(newUser);

    return newUser;
  }

  async findOneByEmail(email: string) {
    const userFound = this.users.find((user) => user.email === email);

    if (!userFound) {
      return null;
    }

    return userFound;
  }

  async findOneById(id: string) {
    const userFound = this.users.find((user) => user.id === id);

    if (!userFound) {
      return null;
    }

    return userFound;
  }
}
