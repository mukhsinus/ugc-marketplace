// backend/src/modules/auth/auth.routes.ts

import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";

import {
  login,
  signup,
  getCurrentUser,
  logout
} from "./auth.controller";

export async function authRoutes(app: FastifyInstance) {

  // --------------------------------
  // AUTH
  // --------------------------------

  app.post(
    "/login",
    login
  );

  app.post(
    "/signup",
    signup
  );

  // --------------------------------
  // CURRENT USER
  // --------------------------------

  app.get(
    "/me",
    {
      preHandler: authMiddleware
    },
    getCurrentUser
  );

  // --------------------------------
  // LOGOUT
  // --------------------------------

  app.post(
    "/logout",
    {
      preHandler: authMiddleware
    },
    logout
  );

}