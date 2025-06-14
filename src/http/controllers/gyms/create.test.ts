import { app } from "@/app";
import { test, describe, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("POST /gyms", () => {
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

      const response = await request(app.server)
        .post("/gyms")
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          title: "name gym",
          latitude: -29.3400876,
          longitude: -49.7346734,
        });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        id: response.body.id,
        title: "name gym",
        description: null,
        phone: null,
        latitude: "-29.3400876",
        longitude: "-49.7346734",
        created_at: response.body.created_at,
        updated_at: response.body.updated_at,
      });
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

      const response = await request(app.server)
        .post("/gyms")
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          title: "name gym",
          latitude: -29.3400876,
          longitude: -49.7346734,
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Recurso não autorizado.",
        action: "O usuário precisa ser admin.",
        name: "UnauthorizedError",
        status_code: 401,
      });
    });
  });

  describe("Logged out user", () => {
    test("Without authorization token", async () => {
      const response = await request(app.server).post("/gyms").send({
        title: "name gym",
        latitude: -29.3400876,
        longitude: -49.7346734,
      });

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
