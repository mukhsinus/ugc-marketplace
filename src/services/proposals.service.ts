// src/services/proposals.service.ts
// ugc-marketplace/src/services/proposals.service.ts

import { api } from "@/lib/api";
import { Proposal } from "@/types/proposal";

export const proposalsService = {

  async getJobProposals(jobId: string): Promise<Proposal[]> {
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
  ): Promise<Proposal> {
    const response = await api.post(`/proposals/${jobId}`, data);
    return response.data;
  },

  async updateProposalStatus(
    proposalId: string,
    status: "accepted" | "rejected"
  ): Promise<Proposal> {
    const response = await api.patch(`/proposals/${proposalId}`, {
      status,
    });

    return response.data;
  },

};