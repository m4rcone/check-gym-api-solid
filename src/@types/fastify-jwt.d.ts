import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { role: "Admin" | "Member" };
    user: {
      sub: string;
      role: "Admin" | "Member";
    };
  }
}
