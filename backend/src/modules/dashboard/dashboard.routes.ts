// backend/src/modules/dashboard/dashboard.routes.ts

import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";

import {
  getBrandDashboard,
  getCreatorDashboard
} from "./dashboard.controller";

export async function dashboardRoutes(app: FastifyInstance) {

  // -----------------------
  // BRAND DASHBOARD
  // -----------------------

  app.get(
    "/brand",
    { preHandler: authMiddleware },
    getBrandDashboard
  );

  // -----------------------
  // CREATOR DASHBOARD
  // -----------------------

  app.get(
    "/creator",
    { preHandler: authMiddleware },
    getCreatorDashboard
  );

}