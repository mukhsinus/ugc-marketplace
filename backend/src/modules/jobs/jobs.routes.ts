// backend/src/modules/jobs/jobs.routes.ts
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
} from "./jobs.controller";

export async function jobsRoutes(app: FastifyInstance) {

  app.get("/", getJobs);

  app.get<{ Params: { id: string } }>("/:id", getJobById);

  app.post(
    "/",
    { preHandler: authMiddleware },
    createJob
  );

  app.patch<{ Params: { id: string } }>(
    "/:id",
    { preHandler: authMiddleware },
    updateJob
  );

}