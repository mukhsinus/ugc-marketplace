// ugc-marketplace/src/services/payouts.service.ts

import { api } from "@/lib/api";
import type { PayoutResponse } from "@/types/api-responses";

export const payoutsService = {

  async getMyPayouts(): Promise<PayoutResponse[]> {
    const response = await api.get("/payouts/me");
    return response.data;
  },

  async createPayout(data: {
    amount: number;
    method: string;
  }): Promise<PayoutResponse> {
    const response = await api.post("/payouts", data);
    return response.data;
  },

};