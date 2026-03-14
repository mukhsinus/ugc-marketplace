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
import { payoutsRoutes } from "./modules/payouts/payouts.routes";
import { contractsRoutes } from "./modules/contracts/contracts.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
import { portfolioRoutes } from "./modules/portfolio/portfolio.routes";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";


const API_PREFIX = "/api/v1";

export async function registerRoutes(app: FastifyInstance) {

  app.register(authRoutes, {
    prefix: `${API_PREFIX}/auth`,
  });

  app.register(usersRoutes, {
    prefix: `${API_PREFIX}/users`,
  });

  app.register(jobsRoutes, {
    prefix: `${API_PREFIX}/jobs`,
  });

  app.register(proposalsRoutes, {
    prefix: `${API_PREFIX}/proposals`,
  });

  app.register(messagesRoutes, {
    prefix: `${API_PREFIX}/messages`,
  });

  app.register(libraryRoutes, {
    prefix: `${API_PREFIX}/library`,
  });

  app.register(creatorsRoutes, {
    prefix: `${API_PREFIX}/creators`,
  });

  app.register(brandsRoutes, {
    prefix: `${API_PREFIX}/brands`,
  });

  app.register(payoutsRoutes, {
    prefix: `${API_PREFIX}/payouts`,
  });

  app.register(contractsRoutes, {
    prefix: `${API_PREFIX}/contracts`,
  });

  app.register(adminRoutes, {
    prefix: `${API_PREFIX}/admin`,
  });

  app.register(portfolioRoutes, {
    prefix: `${API_PREFIX}/portfolio`,
  });

  app.register(dashboardRoutes, {
    prefix: `${API_PREFIX}/dashboard`,
  });

}