import { app } from "@/app";
import { test, describe, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("GET /me", () => {
  describe("Logged in user", () => {
    test("With authorization token", async () => {
      await request(app.server).post("/users").send({
        name: "name",
        email: "name@email.com",
        password: "password",
      });

      const authResponse = await request(app.server).post("/sessions").send({
        email: "name@email.com",
        password: "password",
      });

      const response = await request(app.server)
        .get("/me")
        .set("Authorization", `Bearer ${authResponse.body.token}`);

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        id: response.body.id,
        name: "name",
        email: "name@email.com",
        role: response.body.role,
        created_at: response.body.created_at,
        updated_at: response.body.updated_at,
      });
    });
  });

  describe("Logged out user", () => {
    test("Without authorization token", async () => {
      await request(app.server).post("/users").send({
        name: "name",
        email: "name@email.com",
        password: "password",
      });

      const response = await request(app.server).get("/me").send();

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
