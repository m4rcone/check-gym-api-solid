import { app } from "@/app";
import { test, describe, beforeAll, afterAll, expect, vi } from "vitest";
import request from "supertest";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("GET /check-in/history", () => {
  describe("Logged in user", () => {
    test("User with check-ins", async () => {
      await request(app.server).post("/users").send({
        name: "name",
        email: "name@email.com",
        password: "password",
        role: "Admin",
      });

      vi.useFakeTimers();

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

      await request(app.server)
        .post(`/gyms/${createdGym.body.id}/check-in`)
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          latitude: -29.3400876,
          longitude: -49.7346734,
        });

      vi.advanceTimersByTime(1000 * 60 * 60 * 24 * 1); // 1 Day

      const refreshTokenCookie = authResponse.get("Set-Cookie");

      const refreshResponse = await request(app.server)
        .patch("/token/refresh")
        .set("Cookie", refreshTokenCookie ?? [""])
        .send();

      await request(app.server)
        .post(`/gyms/${createdGym.body.id}/check-in`)
        .set("Authorization", `Bearer ${refreshResponse.body.token}`)
        .send({
          latitude: -29.3400876,
          longitude: -49.7346734,
        });

      vi.useRealTimers();

      const response = await request(app.server)
        .get("/check-ins/history")
        .set("Authorization", `Bearer ${refreshResponse.body.token}`)
        .send();

      expect(response.status).toBe(200);

      expect(response.body).toHaveLength(2);
    });
  });

  describe("Logged out user", () => {
    test("Without authorization token", async () => {
      const response = await request(app.server)
        .get("/check-ins/history")
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
