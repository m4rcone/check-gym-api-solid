import z from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserUseCase } from "@/use-cases/create-user";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { errorHandlerResponse } from "@/infra/controller";

export async function createUser(req: FastifyRequest, res: FastifyReply) {
  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().min(8),
  });

  const { name, email, password } = createUserBodySchema.parse(req.body);

  const usersRepository = new PrismaUsersRepository();
  const createUserUseCase = new CreateUserUseCase(usersRepository);

  let newUser;

  try {
    newUser = await createUserUseCase.execute({ name, email, password });
  } catch (error) {
    return errorHandlerResponse(error, res);
  }

  return res.status(201).send(newUser);
}
