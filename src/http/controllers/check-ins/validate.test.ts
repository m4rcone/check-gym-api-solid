import { app } from "@/app";
import { test, describe, beforeAll, afterAll, expect, vi } from "vitest";
import request from "supertest";
import { randomUUID } from "crypto";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("PATCH check-ins/:checkInId/validate", () => {
  describe("Logged in user", () => {
    test("With user role admin", async () => {
      await request(app.server).post("/users").send({
        name: "name",
        email: "name@email.com",
        password: "password",
        role: "Admin",
      });

      const authResponse = await request(app.server).post("/sessions").send({
        email: "name@email.com",
        password: "password",
      });

      const createdGym = await request(app.server)
        .post("/gyms")
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          title: "name gym",
          latitude: -29.3400876,
          longitude: -49.7346734,
        });

      const createCheckInResponse = await request(app.server)
        .post(`/gyms/${createdGym.body.id}/check-in`)
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          latitude: -29.3400876,
          longitude: -49.7346734,
        });

      const response = await request(app.server)
        .patch(`/check-ins/${createCheckInResponse.body.id}/validate`)
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send();

      expect(response.status).toBe(200);

      expect(response.body.validated_at).not.toBe(null);
      expect(new Date(response.body.validated_at)).not.toBeNaN();
    });

    test("With user role member", async () => {
      await request(app.server).post("/users").send({
        name: "name",
        email: "member@email.com",
        password: "password",
      });

      const authResponse = await request(app.server).post("/sessions").send({
        email: "member@email.com",
        password: "password",
      });

      const createdGym = await request(app.server)
        .post("/gyms")
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          title: "name gym",
          latitude: -29.3400876,
          longitude: -49.7346734,
        });

      const createCheckInResponse = await request(app.server)
        .post(`/gyms/${createdGym.body.id}/check-in`)
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          latitude: -29.3400876,
          longitude: -49.7346734,
        });

      const response = await request(app.server)
        .patch(`/check-ins/${createCheckInResponse.body.id}/validate`)
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send();

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Recurso não autorizado.",
        action: "O usuário precisa ser admin.",
        name: "UnauthorizedError",
        status_code: 401,
      });
    });

    test("With user role admin after 20 min", async () => {
      await request(app.server).post("/users").send({
        name: "name",
        email: "after.20.minutes@email.com",
        password: "password",
        role: "Admin",
      });

      vi.useFakeTimers();

      const authResponse = await request(app.server).post("/sessions").send({
        email: "after.20.minutes@email.com",
        password: "password",
      });

      const createdGym = await request(app.server)
        .post("/gyms")
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          title: "name gym",
          latitude: -29.3400876,
          longitude: -49.7346734,
        });

      const createCheckInResponse = await request(app.server)
        .post(`/gyms/${createdGym.body.id}/check-in`)
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          latitude: -29.3400876,
          longitude: -49.7346734,
        });

      vi.advanceTimersByTime(1000 * 60 * 21); // 21 Minutes

      const refreshTokenCookie = authResponse.get("Set-Cookie");

      const refreshResponse = await request(app.server)
        .patch("/token/refresh")
        .set("Cookie", refreshTokenCookie ?? [""])
        .send();

      const response = await request(app.server)
        .patch(`/check-ins/${createCheckInResponse.body.id}/validate`)
        .set("Authorization", `Bearer ${refreshResponse.body.token}`)
        .send();

      vi.useRealTimers();

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message:
          "Você só pode validar o check-in em até 20 minutos da criação.",
        action: "Você só pode criar e validar um novo check-in amanhã.",
        name: "UnauthorizedError",
        status_code: 401,
      });
    });
  });

  describe("Logged out user", () => {
    test("Without authorization token", async () => {
      const response = await request(app.server)
        .patch(`/check-ins/${randomUUID()}/validate`)
        .send();

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Usuário não autenticado.",
        action: "Faça o login para ter acesso.",
        name: "UnauthorizedError",
        status_code: 401,
      });
    });
  });
});
