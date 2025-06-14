import { app } from "@/app";
import { test, describe, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("POST /sessions", () => {
  describe("Anonymous user", () => {
    test("With valid email and valid password", async () => {
      await request(app.server).post("/users").send({
        name: "name",
        email: "name@email.com",
        password: "password",
      });

      const response = await request(app.server).post("/sessions").send({
        email: "name@email.com",
        password: "password",
      });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        token: response.body.token,
      });
    });

    test("With invalid email and valid password", async () => {
      await request(app.server).post("/users").send({
        name: "name",
        email: "name@email.com",
        password: "password",
      });

      const response = await request(app.server).post("/sessions").send({
        email: "invalid.email@email.com",
        password: "password",
      });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Credenciais inválidas.",
        action: "Verifique os dados enviados e tente novamente.",
        name: "UnauthorizedError",
        status_code: 401,
      });
    });

    test("With valid email and invalid password", async () => {
      await request(app.server).post("/users").send({
        name: "name",
        email: "name@email.com",
        password: "password",
      });

      const response = await request(app.server).post("/sessions").send({
        email: "name@email.com",
        password: "invalidpassword",
      });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Credenciais inválidas.",
        action: "Verifique os dados enviados e tente novamente.",
        name: "UnauthorizedError",
        status_code: 401,
      });
    });
  });
});
