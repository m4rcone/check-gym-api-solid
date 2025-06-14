import { Prisma, CheckIn } from "generated/prisma";

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  validate(id: string): Promise<CheckIn>;
  findOneById(id: string): Promise<CheckIn | null>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
  findManyByUserId(userId: string, page: number): Promise<CheckIn[] | null>;
  countByUserId(userId: string): Promise<number>;
}
