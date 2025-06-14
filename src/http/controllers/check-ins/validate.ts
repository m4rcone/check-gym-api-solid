import z from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-check-in-use-case";

export async function validate(req: FastifyRequest, res: FastifyReply) {
  const validadeCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validadeCheckInParamsSchema.parse(req.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();

  const validatedCheckIn = await validateCheckInUseCase.execute({
    id: checkInId,
  });

  return res.status(200).send(validatedCheckIn);
}
