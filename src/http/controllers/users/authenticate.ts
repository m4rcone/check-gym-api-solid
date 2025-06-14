import z from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { errorHandlerResponse } from "@/infra/controller";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string(),
    password: z.string().min(8),
  });

  const { email, password } = authenticateBodySchema.parse(req.body);

  const authenticateUseCase = makeAuthenticateUseCase();

  let userSession;
  let token;
  let refreshToken;

  try {
    userSession = await authenticateUseCase.execute({ email, password });

    token = await res.jwtSign(
      {
        role: userSession.role,
      },
      {
        sign: {
          sub: userSession.id,
        },
      }
    );

    refreshToken = await res.jwtSign(
      {
        role: userSession.role,
      },
      {
        sign: {
          sub: userSession.id,
          expiresIn: "7d",
        },
      }
    );
  } catch (error) {
    return errorHandlerResponse(error, res);
  }

  return res
    .status(200)
    .setCookie("refresh_token", refreshToken, {
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .send({ token });
}
