// backend/src/modules/admin/admin.schema.ts

import { z } from "zod";


// -----------------------------
// PARAMS
// -----------------------------

export const userParamsSchema = z.object({
  id: z.string().uuid()
});

export const payoutParamsSchema = z.object({
  id: z.string().uuid()
});

export const jobParamsSchema = z.object({
  id: z.string().uuid()
});


// -----------------------------
// SETTINGS
// -----------------------------

export const updateCommissionSchema = z.object({
  value: z
    .number()
    .min(0, "Commission must be at least 0%")
    .max(50, "Commission cannot exceed 50%")
});


// -----------------------------
// TYPES
// -----------------------------

export type UserParams = z.infer<typeof userParamsSchema>;
export type PayoutParams = z.infer<typeof payoutParamsSchema>;
export type JobParams = z.infer<typeof jobParamsSchema>;

export type UpdateCommissionInput = z.infer<typeof updateCommissionSchema>;