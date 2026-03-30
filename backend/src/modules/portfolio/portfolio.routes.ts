// backend/src/modules/portfolio/portfolio.routes.ts
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";
import { getMyPortfolio, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from "./portfolio.controller";

export async function portfolioRoutes(app: FastifyInstance) {

  app.get(
    "/my",
    { preHandler: authMiddleware },
    getMyPortfolio
  );

  app.post(
    "",
    { preHandler: authMiddleware },
    createPortfolioItem
  );

  app.patch(
    "/:id",
    { preHandler: authMiddleware },
    updatePortfolioItem
  );

  app.delete(
    "/:id",
    { preHandler: authMiddleware },
    deletePortfolioItem
  );

}