// backend/src/modules/submissions/submissions.routes.ts
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  getJobSubmissions,
  createSubmission,
  updateSubmission
} from "./submissions.controller";

export async function submissionsRoutes(app: FastifyInstance) {

  app.get(
    "/job/:jobId",
    { preHandler: authMiddleware },
    getJobSubmissions
  );

  app.post(
    "/",
    { preHandler: authMiddleware },
    createSubmission
  );

  app.patch(
    "/:id",
    { preHandler: authMiddleware },
    updateSubmission
  );

}