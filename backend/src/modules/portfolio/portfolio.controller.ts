// backend/src/modules/portfolio/portfolio.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { portfolioService } from "./portfolio.service";
import { success } from "../../utils/apiResponse";

export async function getMyPortfolio(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const items = await portfolioService.getMyPortfolio(
    request.user!.id
  );

  return reply.send(success(items));

}