// ugc-marketplace/src/services/contracts.service.ts

import { api } from "@/lib/api";
import type { ContractResponse, ContractDetailResponse } from "@/types/api-responses";

export const contractsService = {

  async getContractByJob(jobId: string): Promise<ContractDetailResponse | null> {
    const response = await api.get(`/contracts/job/${jobId}`);
    return response.data;
  },

  async createContract(data: {
    job_id: string;
    brand_id: string;
    creator_id: string;
    amount: number;
    currency: string;
  }): Promise<ContractDetailResponse> {
    const response = await api.post("/contracts", data);
    return response.data;
  },

  async releaseEscrow(contractId: string): Promise<void> {
    await api.post(`/contracts/${contractId}/release`);
  },

  async cancelEscrow(contractId: string): Promise<void> {
    await api.post(`/contracts/${contractId}/cancel`);
  }

};
