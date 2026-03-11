// backend/src/modules/brands/brands.routes.ts
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  getBrands,
  getBrandById,
  updateBrandProfile
} from "./brands.controller";

export async function brandsRoutes(app: FastifyInstance) {

  // public brands catalog
  app.get("/", getBrands);

  // single brand
  app.get("/:id", getBrandById);

  // update own brand profile
  app.patch(
    "/profile",
    { preHandler: authMiddleware },
    updateBrandProfile
  );

}