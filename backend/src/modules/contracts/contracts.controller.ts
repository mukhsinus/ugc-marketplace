// backend/src/modules/contracts/contracts.controller.ts
// backend/src/modules/contracts/contracts.controller.ts

import { FastifyRequest, FastifyReply } from "fastify";
import { contractsService } from "./contracts.service";

export async function createContract(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { job_id, creator_id, amount, currency } = request.body as any;

  const brandId = request.user?.id;

  if (!brandId) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  const contract = await contractsService.createContract(
    job_id,
    brandId,
    creator_id,
    amount,
    currency
  );

  return reply.status(201).send(contract);
}

export async function getContractByJob(
  request: FastifyRequest<{ Params: { jobId: string } }>,
  reply: FastifyReply
) {
  const contract = await contractsService.getContractByJob(
    request.params.jobId
  );

  if (!contract) {
    return reply.status(404).send({ error: "Contract not found" });
  }

  return reply.send(contract);
}

export async function createEscrow(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const {
    contract_id,
    payer_wallet_id,
    payee_wallet_id,
    amount,
    currency
  } = request.body as any;

  const escrow = await contractsService.createEscrow(
    contract_id,
    payer_wallet_id,
    payee_wallet_id,
    amount,
    currency
  );

  return reply.status(201).send(escrow);
}

export async function releaseEscrow(
  request: FastifyRequest<{ Params: { contractId: string } }>,
  reply: FastifyReply
) {
  await contractsService.releaseEscrow(request.params.contractId);

  return reply.send({ success: true });
}

export async function cancelEscrow(
  request: FastifyRequest<{ Params: { contractId: string } }>,
  reply: FastifyReply
) {
  await contractsService.cancelEscrow(request.params.contractId);

  return reply.send({ success: true });
}