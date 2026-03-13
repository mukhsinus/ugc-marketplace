// backend/src/modules/messages/messages.controller.ts

import { FastifyRequest, FastifyReply } from "fastify";
import { messagesService } from "./messages.service";
import { success } from "../../utils/apiResponse";

export async function getConversations(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const conversations =
    await messagesService.getConversations(request.user!.id);

  return reply.send(success(conversations));

}

export async function getMessages(
  request: FastifyRequest<{ Params: { jobId: string } }>,
  reply: FastifyReply
) {

  const result =
    await messagesService.getMessages(
      request.user!.id,
      request.params.jobId
    );

  return reply.send(success(result));

}

export async function sendMessage(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const message =
    await messagesService.sendMessage(
      request.user!.id,
      request.body as any
    );

  return reply
    .status(201)
    .send(success(message));

}

export async function markMessageSeen(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  const message =
    await messagesService.markMessageSeen(
      request.user!.id,
      request.params.id
    );

  return reply.send(success(message));

}

export async function deleteMessage(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  const message =
    await messagesService.deleteMessage(
      request.user!.id,
      request.params.id
    );

  return reply.send(success(message));

}