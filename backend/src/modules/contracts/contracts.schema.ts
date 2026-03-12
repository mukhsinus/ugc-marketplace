// backend/src/modules/contracts/contracts.schema.ts

import { z } from "zod";

export const createContractSchema = z.object({
  job_id: z.string().uuid(),
  creator_id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.enum(["UZS", "USD", "EUR"])
});

export const createEscrowSchema = z.object({
  contract_id: z.string().uuid(),
  payer_wallet_id: z.string().uuid(),
  payee_wallet_id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.enum(["UZS", "USD", "EUR"])
});

export const contractParamsSchema = z.object({
  contractId: z.string().uuid()
});

export const jobParamsSchema = z.object({
  jobId: z.string().uuid()
});

export type CreateContractInput = z.infer<typeof createContractSchema>;
export type CreateEscrowInput = z.infer<typeof createEscrowSchema>;
export type ContractParams = z.infer<typeof contractParamsSchema>;
export type JobParams = z.infer<typeof jobParamsSchema>;