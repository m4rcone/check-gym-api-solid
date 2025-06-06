import { env } from "@/env";
import { hash } from "bcryptjs";
import { UsersRepository } from "@/repositories/users-repository";
import { ValidationError } from "@/infra/errors";
import { type User } from "generated/prisma";

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class CreateUserUseCase {
  private userRepository;

  constructor(userRepository: UsersRepository) {
    this.userRepository = userRepository;
  }

  async execute({
    name,
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<User> {
    const userFound = await this.userRepository.findOneByEmail(email);

    if (userFound) {
      throw new ValidationError({
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro e-mail para realizar a operação.",
      });
    }

    const hashedPassword = await hash(password, getNumberOfRounds());

    const createdUser = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return createdUser;

    function getNumberOfRounds() {
      return env.NODE_ENV === "production" ? 14 : 1;
    }
  }
}
