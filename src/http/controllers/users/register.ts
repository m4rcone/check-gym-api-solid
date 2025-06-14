import z from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { errorHandlerResponse } from "@/infra/controller";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().min(8),
    role: z.enum(["Admin", "Member"]).optional(),
  });

  const { name, email, password, role } = registerBodySchema.parse(req.body);

  const registerUseCase = makeRegisterUseCase();

  let newUser;

  try {
    newUser = await registerUseCase.execute({ name, email, password, role });
  } catch (error) {
    return errorHandlerResponse(error, res);
  }

  return res.status(201).send({
    ...newUser,
    password: undefined,
  });
}
