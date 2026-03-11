// backend/src/modules/library/library.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { libraryService } from "./library.service";

export async function getLibrary(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {

    const category = (request.query as any)?.category;

    const items = await libraryService.getLibrary(category);

    return reply.send(items);

  } catch (err) {

    request.log.error(err);

    return reply.status(500).send({
      error: "Failed to load library"
    });

  }

}

export async function getLibraryItem(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  try {

    const item = await libraryService.getLibraryItem(request.params.id);

    return reply.send(item);

  } catch (err) {

    request.log.error(err);

    return reply.status(404).send({
      error: "Item not found"
    });

  }

}

export async function createLibraryItem(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {

    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const item = await libraryService.createLibraryItem(
      userId,
      request.body as any
    );

    return reply.status(201).send(item);

  } catch (err) {

    request.log.error(err);

    return reply.status(400).send({
      error: "Failed to create library item"
    });

  }

}

export async function deleteLibraryItem(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  try {

    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    await libraryService.deleteLibraryItem(userId, request.params.id);

    return reply.send({ success: true });

  } catch (err) {

    request.log.error(err);

    return reply.status(403).send({
      error: "Not allowed to delete this item"
    });

  }

}