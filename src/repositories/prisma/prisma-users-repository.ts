import { prisma } from "@/infra/prisma";
import { type Prisma } from "generated/prisma";
import { UsersRepository } from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const newUser = await prisma.user.create({
      data,
    });

    return newUser;
  }

  async findOneByEmail(email: string) {
    const userFound = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return userFound;
  }

  async findOneById(id: string) {
    const userFound = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return userFound;
  }
}
