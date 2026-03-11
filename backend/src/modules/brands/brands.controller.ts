// backend/src/modules/brands/brands.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { brandsService } from "./brands.service";

export async function getBrands(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {

    const query = request.query as any;

    const brands = await brandsService.getBrands(query);

    return reply.send(brands);

  } catch (err) {

    request.log.error(err);

    return reply.status(500).send({
      error: "Failed to load brands"
    });

  }

}

export async function getBrandById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  try {

    const brand = await brandsService.getBrandById(
      request.params.id
    );

    return reply.send(brand);

  } catch (err) {

    request.log.error(err);

    return reply.status(404).send({
      error: "Brand not found"
    });

  }

}

export async function updateBrandProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {

    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({
        error: "Unauthorized"
      });
    }

    const updated = await brandsService.updateBrandProfile(
      userId,
      request.body as any
    );

    return reply.send(updated);

  } catch (err) {

    request.log.error(err);

    return reply.status(400).send({
      error: "Failed to update profile"
    });

  }

}