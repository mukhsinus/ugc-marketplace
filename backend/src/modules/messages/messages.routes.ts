// backend/src/modules/messages/messages.routes.ts
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.middleware";

import {
  getConversations,
  getMessages,
  sendMessage,
  markMessageSeen,
  deleteMessage
} from "./messages.controller";

export async function messagesRoutes(app: FastifyInstance) {

  app.get(
    "/conversations",
    { preHandler: authMiddleware },
    getConversations
  );

  app.get(
    "/:jobId",
    { preHandler: authMiddleware },
    getMessages
  );

  app.post(
    "/",
    { preHandler: authMiddleware },
    sendMessage
  );

  app.patch(
    "/:id/seen",
    { preHandler: authMiddleware },
    markMessageSeen
  );

  app.delete(
    "/:id",
    { preHandler: authMiddleware },
    deleteMessage
  );

}