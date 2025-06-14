import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { create } from "./create";
import { validate } from "./validate";
import { history } from "./history";
import { metrics } from "./metrics";
import { verifyUserAdmin } from "@/http/middlewares/verify-user-admin";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/gyms/:gymId/check-in", create);
  app.patch(
    "/check-ins/:checkInId/validate",
    { onRequest: [verifyUserAdmin] },
    validate
  );
  app.get("/check-ins/history", history);
  app.get("/check-ins/metrics", metrics);
}
