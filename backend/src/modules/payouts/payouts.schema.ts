// backend/src/modules/payouts/payouts.schema.ts
import { z } from "zod";

export const createPayoutSchema = z.object({
  amount: z.number().positive(),
  method: z.string().min(2),
});

export const updatePayoutStatusSchema = z.object({
  status: z.enum(["approved", "rejected", "paid"]),
  external_reference: z.string().optional(),
});

export type CreatePayoutInput = z.infer<typeof createPayoutSchema>;
export type UpdatePayoutStatusInput = z.infer<typeof updatePayoutStatusSchema>;