// backend/src/routes.ts
import { FastifyInstance } from "fastify";

import { authRoutes } from "./modules/auth/auth.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { jobsRoutes } from "./modules/jobs/jobs.routes";
import { proposalsRoutes } from "./modules/proposals/proposals.routes";
import { messagesRoutes } from "./modules/messages/messages.routes";
import { libraryRoutes } from "./modules/library/library.routes";
import { creatorsRoutes } from "./modules/creators/creators.routes";
import { brandsRoutes } from "./modules/brands/brands.routes";

export async function registerRoutes(app: FastifyInstance) {

  app.register(authRoutes, {
    prefix: "/api/auth",
  });

  app.register(usersRoutes, {
    prefix: "/api/users",
  });

  app.register(jobsRoutes, {
    prefix: "/api/jobs",
  });

  app.register(proposalsRoutes, {
    prefix: "/api/proposals",
  });

  app.register(messagesRoutes, {
    prefix: "/api/messages",
  });

  app.register(libraryRoutes, {
    prefix: "/api/library",
  });

  app.register(creatorsRoutes, {
    prefix: "/api/creators",
  });

  app.register(brandsRoutes, {
    prefix: "/api/brands",
  });
}