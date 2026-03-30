// src/services/proposals.service.ts
// ugc-marketplace/src/services/proposals.service.ts

import { api } from "@/lib/api";
import type { ProposalResponse, ProposalDetailResponse } from "@/types/api-responses";

export const proposalsService = {

  async getJobProposals(jobId: string): Promise<ProposalDetailResponse[]> {
    const response = await api.get(`/proposals/job/${jobId}`);
    return response.data;
  },

  async createProposal(
    jobId: string,
    data: {
      message?: string;
      price_offer?: number;
      delivery_time?: number;
    }
  ): Promise<ProposalDetailResponse> {
    const response = await api.post(`/proposals/${jobId}`, data);
    return response.data;
  },

  async updateProposalStatus(
    proposalId: string,
    status: "accepted" | "rejected"
  ): Promise<ProposalDetailResponse> {
    const response = await api.patch(`/proposals/${proposalId}`, {
      status,
    });

    return response.data;
  },

};