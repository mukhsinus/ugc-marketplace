// backend/src/modules/creators/creators.routes.ts
import { FastifyInstance } from "fastify";
import {
  getCreators,
  getCreatorById
} from "./creators.controller";

export async function creatorsRoutes(app: FastifyInstance) {

  // creators catalog
  app.get("/", getCreators);

  // single creator
  app.get("/:id", getCreatorById);

}