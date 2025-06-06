import { Prisma, User } from "generated/prisma";

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findOneByEmail(email: string): Promise<User | null>;
}
