// backend/src/modules/messages/messages.routes.ts
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  getMessages,
  sendMessage
} from "./messages.controller";

export async function messagesRoutes(app: FastifyInstance) {

  app.get(
    "/job/:jobId",
    { preHandler: authMiddleware },
    getMessages
  );

  app.post(
    "/",
    { preHandler: authMiddleware },
    sendMessage
  );

}