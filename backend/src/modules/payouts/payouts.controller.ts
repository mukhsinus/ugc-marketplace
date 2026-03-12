// backend/src/modules/payouts/payouts.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { payoutsService } from "./payouts.service";
import {
  createPayoutSchema,
  updatePayoutStatusSchema
} from "./payouts.schema";

export async function createPayout(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const parsed = createPayoutSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send(parsed.error);
  }

  const payout = await payoutsService.createPayout(
    request.user!.id,
    parsed.data
  );

  return reply.status(201).send(payout);
}

export async function getMyPayouts(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const payouts = await payoutsService.getUserPayouts(
    request.user!.id
  );

  return reply.send(payouts);
}

export async function updatePayoutStatus(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  const parsed = updatePayoutStatusSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send(parsed.error);
  }

  const payout = await payoutsService.updatePayoutStatus(
    request.params.id,
    parsed.data.status,
    parsed.data.external_reference
  );

  return reply.send(payout);
}