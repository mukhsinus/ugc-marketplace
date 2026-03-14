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
    .string()
    .regex(/^\d+$/)
    .refine((v) => {
      const n = Number(v);
      return n >= 0 && n <= 50;
    }, {
      message: "Commission must be between 0 and 50"
    })
});


// -----------------------------
// TYPES
// -----------------------------

export type UserParams = z.infer<typeof userParamsSchema>;
export type PayoutParams = z.infer<typeof payoutParamsSchema>;
export type JobParams = z.infer<typeof jobParamsSchema>;

export type UpdateCommissionInput = z.infer<typeof updateCommissionSchema>;