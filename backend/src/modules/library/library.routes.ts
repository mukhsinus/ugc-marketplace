// backend/src/modules/library/library.routes.ts
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  getLibrary,
  getLibraryItem,
  createLibraryItem,
  deleteLibraryItem
} from "./library.controller";

export async function libraryRoutes(app: FastifyInstance) {

  // public catalog
  app.get("/", getLibrary);

  // single item
  app.get("/:id", getLibraryItem);

  // upload content
  app.post(
    "/",
    { preHandler: authMiddleware },
    createLibraryItem
  );

  // delete content
  app.delete(
    "/:id",
    { preHandler: authMiddleware },
    deleteLibraryItem
  );

}