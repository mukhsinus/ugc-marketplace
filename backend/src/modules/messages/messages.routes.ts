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

  app.get<{ Params: { jobId: string } }>(
    "/:jobId",
    { preHandler: authMiddleware },
    getMessages
  );

  app.post(
    "/",
    { preHandler: authMiddleware },
    sendMessage
  );

  app.patch<{ Params: { id: string } }>(
    "/:id/seen",
    { preHandler: authMiddleware },
    markMessageSeen
  );

  app.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: authMiddleware },
    deleteMessage
  );

}