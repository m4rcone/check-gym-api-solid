import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { create } from "./create";
import { search } from "./search";
import { nearby } from "./nearby";
import { verifyUserAdmin } from "@/http/middlewares/verify-user-admin";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/gyms", { onRequest: [verifyUserAdmin] }, create);
  app.get("/gyms/search", search);
  app.get("/gyms/nearby", nearby);
}
