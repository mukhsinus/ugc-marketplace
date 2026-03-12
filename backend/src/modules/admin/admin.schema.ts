// backend/src/modules/admin/admin.schema.ts
import { z } from "zod";


export const userParamsSchema = z.object({
  id: z.string().uuid()
});


export const payoutParamsSchema = z.object({
  id: z.string().uuid()
});


export const jobParamsSchema = z.object({
  id: z.string().uuid()
});


export type UserParams = z.infer<typeof userParamsSchema>;
export type PayoutParams = z.infer<typeof payoutParamsSchema>;
export type JobParams = z.infer<typeof jobParamsSchema>;