// backend/src/modules/proposals/proposals.schema.ts
import { z } from "zod";

export const createProposalSchema = z.object({
  message: z.string().max(2000).optional(),
  price_offer: z.number().positive().optional(),
  delivery_time: z.number().int().positive().optional()
});

export const updateProposalSchema = z.object({
  status: z.enum(["accepted", "rejected"])
});

export type CreateProposalInput = z.infer<typeof createProposalSchema>;
export type UpdateProposalInput = z.infer<typeof updateProposalSchema>;