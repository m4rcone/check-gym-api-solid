import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { describe, expect, test, vi } from "vitest";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { randomUUID } from "node:crypto";
import { NotFoundError, UnauthorizedError } from "@/infra/errors";

describe("Validate Check In Use Case", () => {
  test("Should be able to validate a check-in", async () => {
    const checkInsRepository = new InMemoryCheckInsRepository();
    const validateCheckInUseCase = new ValidateCheckInUseCase(
      checkInsRepository
    );

    const createdCheckIn = await checkInsRepository.create({
      user_id: randomUUID(),
      gym_id: randomUUID(),
    });

    const validatedCheckIn = await validateCheckInUseCase.execute({
      id: createdCheckIn.id,
    });

    expect(validatedCheckIn.validated_at).not.toBe(null);
  });

  test("Should not be able to validate a check-in with non-existent id", async () => {
    const checkInsRepository = new InMemoryCheckInsRepository();
    const validateCheckInUseCase = new ValidateCheckInUseCase(
      checkInsRepository
    );

    await expect(() =>
      validateCheckInUseCase.execute({
        id: randomUUID(),
      })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  test("Should not be able to validate a check-in after 20 minutes", async () => {
    const checkInsRepository = new InMemoryCheckInsRepository();
    const validateCheckInUseCase = new ValidateCheckInUseCase(
      checkInsRepository
    );

    vi.useFakeTimers();

    const createdCheckIn = await checkInsRepository.create({
      user_id: randomUUID(),
      gym_id: randomUUID(),
    });

    vi.advanceTimersByTime(1000 * 60 * 21); // 21 Minutes

    await expect(() =>
      validateCheckInUseCase.execute({
        id: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
