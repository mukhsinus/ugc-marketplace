// backend/src/modules/contracts/contracts.routes.ts
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";

import {
  createContract,
  getContractByJob,
  createEscrow,
  releaseEscrow,
  cancelEscrow
} from "./contracts.controller";

export async function contractsRoutes(app: FastifyInstance) {

  app.post(
    "/",
    { preHandler: authMiddleware },
    createContract
  );

  app.get<{ Params: { jobId: string } }>(
    "/job/:jobId",
    { preHandler: authMiddleware },
    getContractByJob
  );

  app.post(
    "/escrow",
    { preHandler: authMiddleware },
    createEscrow
  );

  app.patch<{ Params: { contractId: string } }>(
    "/:contractId/release",
    { preHandler: authMiddleware },
    releaseEscrow
  );

  app.patch<{ Params: { contractId: string } }>(
    "/:contractId/cancel",
    { preHandler: authMiddleware },
    cancelEscrow
  );

}