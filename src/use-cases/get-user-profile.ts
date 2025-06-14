import { NotFoundError } from "@/infra/errors";
import { UsersRepository } from "@/repositories/users-repository";
import { User } from "generated/prisma";

interface GetUserProfileUseCaseRequest {
  userId: string;
}

export class GetUserProfileUseCase {
  private usersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({ userId }: GetUserProfileUseCaseRequest): Promise<User> {
    const userFound = await this.usersRepository.findOneById(userId);

    if (!userFound) {
      throw new NotFoundError({});
    }

    return userFound;
  }
}
