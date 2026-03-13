// backend/src/modules/proposals/proposals.routes.ts
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  createProposal,
  updateProposal,
  getJobProposals
} from "./proposals.controller";

export async function proposalsRoutes(app: FastifyInstance) {

  app.get<{ Params: { jobId: string } }>(
    "/job/:jobId",
    { preHandler: authMiddleware },
    getJobProposals
  );

  app.post<{ Params: { jobId: string } }>(
    "/job/:jobId",
    { preHandler: authMiddleware },
    createProposal
  );

  app.patch<{ Params: { id: string } }>(
    "/:id",
    { preHandler: authMiddleware },
    updateProposal
  );

}