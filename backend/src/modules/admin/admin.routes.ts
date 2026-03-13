// backend/src/modules/admin/admin.routes.ts
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";

import {
  getUsers,
  banUser,
  unbanUser,
  getPayouts,
  approvePayout,
  rejectPayout,
  getJobs,
  deleteJob
} from "./admin.controller";

export async function adminRoutes(app: FastifyInstance) {

  app.get(
    "/users",
    { preHandler: [authMiddleware, adminMiddleware] },
    getUsers
  );

  app.patch<{ Params: { id: string } }>(
    "/users/:id/ban",
    { preHandler: [authMiddleware, adminMiddleware] },
    banUser
  );

  app.patch<{ Params: { id: string } }>(
    "/users/:id/unban",
    { preHandler: [authMiddleware, adminMiddleware] },
    unbanUser
  );

  app.get(
    "/payouts",
    { preHandler: [authMiddleware, adminMiddleware] },
    getPayouts
  );

  app.patch<{ Params: { id: string } }>(
    "/payouts/:id/approve",
    { preHandler: [authMiddleware, adminMiddleware] },
    approvePayout
  );

  app.patch<{ Params: { id: string } }>(
    "/payouts/:id/reject",
    { preHandler: [authMiddleware, adminMiddleware] },
    rejectPayout
  );

  app.get(
    "/jobs",
    { preHandler: [authMiddleware, adminMiddleware] },
    getJobs
  );

  app.delete<{ Params: { id: string } }>(
    "/jobs/:id",
    { preHandler: [authMiddleware, adminMiddleware] },
    deleteJob
  );

}