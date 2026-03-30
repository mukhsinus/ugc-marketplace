// backend/src/modules/proposals/proposals.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { proposalsService } from "./proposals.service";
import {
  createProposalSchema,
  updateProposalSchema
} from "./proposals.schema";
import type { ProposalResponse, ProposalDetailResponse, ProposalsListResponse } from "../../types/responses";

export async function getJobProposals(
  request: FastifyRequest<{ Params: { jobId: string } }>,
  reply: FastifyReply
): Promise<void> {
  const proposals: ProposalDetailResponse[] = await proposalsService.getJobProposals(
    request.params.jobId,
    request.user!.id
  );

  return reply.send(proposals);
}

export async function createProposal(
  request: FastifyRequest<{ Params: { jobId: string } }>,
  reply: FastifyReply
): Promise<void> {
  const parsed = createProposalSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send(parsed.error);
  }

  const proposal: ProposalDetailResponse = await proposalsService.createProposal(
    request.user!.id,
    request.params.jobId,
    parsed.data
  );

  return reply.status(201).send(proposal);
}

export async function updateProposal(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  const parsed = updateProposalSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send(parsed.error);
  }

  const proposal: ProposalDetailResponse = await proposalsService.updateProposal(
    request.user!.id,
    request.params.id,
    parsed.data
  );

  return reply.send(proposal);
}