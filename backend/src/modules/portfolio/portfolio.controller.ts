// backend/src/modules/portfolio/portfolio.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { portfolioService } from "./portfolio.service";
import { success } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export async function getMyPortfolio(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const items = await portfolioService.getMyPortfolio(
    request.user!.id
  );

  return reply.send(success(items));

}

export const createPortfolioItem = asyncHandler(
  async (request: FastifyRequest, reply: FastifyReply) => {

    const item = await portfolioService.createPortfolioItem(
      request.user!.id,
      request.body
    );

    return reply.status(201).send(success(item));

  }
);

export const updatePortfolioItem = asyncHandler(
  async (request: FastifyRequest, reply: FastifyReply) => {

    const { id } = request.params as { id: string };
    const item = await portfolioService.updatePortfolioItem(
      id,
      request.body
    );

    return reply.send(success(item));

  }
);

export const deletePortfolioItem = asyncHandler(
  async (request: FastifyRequest, reply: FastifyReply) => {

    const { id } = request.params as { id: string };
    await portfolioService.deletePortfolioItem(id);

    return reply.send(success({ deleted: true }));

  }
);