import { env } from "@/env";
import { hash } from "bcryptjs";
import { UsersRepository } from "@/repositories/users-repository";
import { ValidationError } from "@/infra/errors";
import { type User } from "generated/prisma";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
  role?: "Admin" | "Member";
}

export class RegisterUseCase {
  private usersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({
    name,
    email,
    password,
    role,
  }: RegisterUseCaseRequest): Promise<User> {
    const userFound = await this.usersRepository.findOneByEmail(email);

    if (userFound) {
      throw new ValidationError({
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar a operação.",
      });
    }

    const hashedPassword = await hash(password, getNumberOfRounds());

    const registeredUser = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return registeredUser;

    function getNumberOfRounds() {
      return env.NODE_ENV === "production" ? 14 : 1;
    }
  }
}
