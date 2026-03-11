// backend/src/modules/creators/creators.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { creatorsService } from "./creators.service";

export async function getCreators(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {

    const query = request.query as any;

    const creators = await creatorsService.getCreators(query);

    return reply.send(creators);

  } catch (err) {

    request.log.error(err);

    return reply.status(500).send({
      error: "Failed to load creators"
    });

  }

}

export async function getCreatorById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  try {

    const creator = await creatorsService.getCreatorById(
      request.params.id
    );

    return reply.send(creator);

  } catch (err) {

    request.log.error(err);

    return reply.status(404).send({
      error: "Creator not found"
    });

  }

}