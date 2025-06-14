import { app } from "@/app";
import { test, describe, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("GET /gyms/nearby", () => {
  describe("Logged in user", () => {
    test("With existent nearby gym", async () => {
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

      const createGymResponse = await request(app.server)
        .post("/gyms")
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          title: "name gym",
          latitude: -29.3400876,
          longitude: -49.7346734,
        });

      const response = await request(app.server)
        .get("/gyms/nearby")
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .query({
          latitude: -29.3353892,
          longitude: -49.7292035,
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual([
        {
          id: createGymResponse.body.id,
          title: createGymResponse.body.title,
          description: null,
          phone: null,
          latitude: createGymResponse.body.latitude.toString(),
          longitude: createGymResponse.body.longitude.toString(),
          created_at: createGymResponse.body.created_at,
          updated_at: createGymResponse.body.updated_at,
        },
      ]);
    });

    test("With non-existent nearby gym", async () => {
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

      await request(app.server)
        .post("/gyms")
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          title: "name gym",
          latitude: -29.3400876,
          longitude: -49.7346734,
        });

      const response = await request(app.server)
        .get("/gyms/nearby")
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .query({
          latitude: -39.3353892,
          longitude: -59.7292035,
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual([]);
    });
  });

  describe("Logged out user", () => {
    test("Without authorization token", async () => {
      const response = await request(app.server).get("/gyms/nearby").query({
        latitude: -39.3353892,
        longitude: -59.7292035,
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
