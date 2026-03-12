// ugc-marketplace/src/services/payouts.service.ts

import { api } from "@/lib/api";
import { Payout } from "@/types/payout";

export const payoutsService = {

  async getMyPayouts(): Promise<Payout[]> {
    const response = await api.get("/payouts/me");
    return response.data;
  },

  async createPayout(data: {
    amount: number;
    method: string;
  }): Promise<Payout> {
    const response = await api.post("/payouts", data);
    return response.data;
  },

};