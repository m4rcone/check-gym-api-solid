import { UnauthorizedError } from "@/infra/errors";
import { UsersRepository } from "@/repositories/users-repository";
import { compare } from "bcryptjs";
import { User } from "generated/prisma";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

export class AuthenticateUseCase {
  private usersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<User> {
    const user = await this.usersRepository.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedError({
        message: "Credenciais inválidas.",
        action: "Verifique os dados enviados e tente novamente.",
      });
    }

    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedError({
        message: "Credenciais inválidas.",
        action: "Verifique os dados enviados e tente novamente.",
      });
    }

    return user;
  }
}
