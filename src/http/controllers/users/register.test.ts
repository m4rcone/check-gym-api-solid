import { app } from "@/app";
import { test, describe, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("POST /users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await request(app.server).post("/users").send({
        name: "name",
        email: "name@email.com",
        password: "password",
      });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        id: response.body.id,
        name: "name",
        email: "name@email.com",
        created_at: response.body.created_at,
        updated_at: response.body.updated_at,
        role: response.body.role,
      });
    });

    test("With duplicated email", async () => {
      await request(app.server).post("/users").send({
        name: "name",
        email: "name@email.com",
        password: "password",
      });

      const response = await request(app.server).post("/users").send({
        name: "name",
        email: "name@email.com",
        password: "password",
      });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar a operação.",
        name: "ValidationError",
        status_code: 400,
      });
    });
  });
});
