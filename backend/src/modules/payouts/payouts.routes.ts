// backend/src/modules/payouts/payouts.routes.ts
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";

import {
  createPayout,
  getMyPayouts,
  updatePayoutStatus
} from "./payouts.controller";

export async function payoutsRoutes(app: FastifyInstance) {

  app.get(
    "/me",
    { preHandler: authMiddleware },
    getMyPayouts
  );

  app.post(
    "/",
    { preHandler: authMiddleware },
    createPayout
  );

  app.patch(
    "/:id",
    { preHandler: authMiddleware },
    updatePayoutStatus
  );

}