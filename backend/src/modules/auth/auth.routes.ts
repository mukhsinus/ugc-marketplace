// backend/src/modules/auth/auth.routes.ts
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";
import { getCurrentUser, logout } from "./auth.controller";

export async function authRoutes(app: FastifyInstance) {

  // Current authenticated user
  app.get(
    "/me",
    {
      preHandler: authMiddleware
    },
    getCurrentUser
  );

  // Logout endpoint (optional)
  app.post(
    "/logout",
    {
      preHandler: authMiddleware
    },
    logout
  );

}