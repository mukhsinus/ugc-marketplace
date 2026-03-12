// backend/src/modules/messages/messages.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { messagesService } from "./messages.service";

export async function getMessages(
  request: FastifyRequest<{ Params: { jobId: string } }>,
  reply: FastifyReply
) {

  const messages = await messagesService.getMessages(
    request.user!.id,
    request.params.jobId
  );

  return reply.send(messages);
}

export async function sendMessage(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const message = await messagesService.sendMessage(
    request.user!.id,
    request.body as any
  );

  return reply.status(201).send(message);
}

export async function markMessageSeen(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  const message = await messagesService.markMessageSeen(
    request.user!.id,
    request.params.id
  );

  return reply.send(message);
}