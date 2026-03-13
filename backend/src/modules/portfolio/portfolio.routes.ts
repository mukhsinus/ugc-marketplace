// backend/src/modules/portfolio/portfolio.routes.ts
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";
import { getMyPortfolio } from "./portfolio.controller";

export async function portfolioRoutes(app: FastifyInstance) {

  app.get(
    "/my",
    { preHandler: authMiddleware },
    getMyPortfolio
  );

}