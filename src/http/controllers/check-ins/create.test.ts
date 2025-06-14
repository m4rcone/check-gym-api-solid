import { app } from "@/app";
import { test, describe, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";
import { randomUUID } from "node:crypto";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("POST /gyms/:gymId/check-in", () => {
  describe("Logged in user", () => {
    test("With existent gym id and valid location", async () => {
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
        .post(`/gyms/${createGymResponse.body.id}/check-in`)
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          latitude: -29.3400876,
          longitude: -49.7346734,
        });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        id: response.body.id,
        user_id: response.body.user_id,
        gym_id: createGymResponse.body.id,
        created_at: response.body.created_at,
        validated_at: null,
      });
    });

    test("With existent gym id and invalid location", async () => {
      await request(app.server).post("/users").send({
        name: "name",
        email: "invalid.location@email.com",
        password: "password",
        role: "Admin",
      });

      const authResponse = await request(app.server).post("/sessions").send({
        email: "invalid.location@email.com",
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
        .post(`/gyms/${createGymResponse.body.id}/check-in`)
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          latitude: -39.3400876,
          longitude: -59.7346734,
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Distante demais da academia para o check-in.",
        action:
          "Você precisa estar a no máximo 0.1 km da academia para realizar o check-in.",
        name: "UnauthorizedError",
        status_code: 401,
      });
    });

    test("With existent check-in on the same day", async () => {
      await request(app.server).post("/users").send({
        name: "name",
        email: "same.day@email.com",
        password: "password",
        role: "Admin",
      });

      const authResponse = await request(app.server).post("/sessions").send({
        email: "same.day@email.com",
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

      await request(app.server)
        .post(`/gyms/${createGymResponse.body.id}/check-in`)
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          latitude: -29.3400876,
          longitude: -49.7346734,
        });

      const response = await request(app.server)
        .post(`/gyms/${createGymResponse.body.id}/check-in`)
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          latitude: -29.3400876,
          longitude: -49.7346734,
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Já foi realizado um check-in por este usuário hoje.",
        action: "Você só pode realizar um novo check-in amanhã.",
        name: "UnauthorizedError",
        status_code: 401,
      });
    });

    test("With non-existent gym id", async () => {
      await request(app.server).post("/users").send({
        name: "name",
        email: "non-existent.gym@email.com",
        password: "password",
        role: "Admin",
      });

      const authResponse = await request(app.server).post("/sessions").send({
        email: "non-existent.gym@email.com",
        password: "password",
      });

      const response = await request(app.server)
        .post(`/gyms/${randomUUID()}/check-in`)
        .set("Authorization", `Bearer ${authResponse.body.token}`)
        .send({
          latitude: -39.3400876,
          longitude: -59.7346734,
        });

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        message: "O recurso solicitado não foi encontrado no sistema.",
        action: "Verifique se os parâmetros da consulta estão corretos.",
        name: "NotFoundError",
        status_code: 404,
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
