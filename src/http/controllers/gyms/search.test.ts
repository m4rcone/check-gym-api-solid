import { app } from "@/app";
import { test, describe, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("GET /gyms/search", () => {
  describe("Logged in user", () => {
    test("With existent gym title", async () => {
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

      // Create 22 gyms
      for (let i = 1; i <= 22; i++) {
        await request(app.server)
          .post("/gyms")
          .set("Authorization", `Bearer ${authResponse.body.token}`)
          .send({
            title: `name gym ${i}`,
            latitude: -29.3400876,
            longitude: -49.7346734,
          });
      }

      const page1Response = await request(app.server)
        .get("/gyms/search")
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .query({
          query: "gym",
          page: 1,
        });

      const page2Response = await request(app.server)
        .get("/gyms/search")
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .query({
          query: "22",
          page: 1,
        });

      expect(page1Response.status).toBe(200);
      expect(page1Response.body).toHaveLength(20);

      expect(page2Response.status).toBe(200);
      expect(page2Response.body).toHaveLength(1);
    });

    test("With non-existent gym title", async () => {
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
        .get("/gyms/search")
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .query({
          query: "non-existent gym",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("Logged out user", () => {
    test("Without authorization token", async () => {
      const response = await request(app.server).get("/gyms/search").query({
        query: "non-existent gym",
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
