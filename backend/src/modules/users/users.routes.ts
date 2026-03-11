// backend/src/modules/users/users.routes.ts
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";
import { getMe, updateProfile } from "./users.controller";

export async function usersRoutes(app: FastifyInstance) {

  app.get(
    "/me",
    {
      preHandler: authMiddleware,
    },
    getMe
  );

  app.patch(
    "/profile",
    {
      preHandler: authMiddleware,
    },
    updateProfile
  );

}