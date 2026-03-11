// backend/src/modules/proposals/proposals.service.ts
import { proposalsRepository } from "./proposals.repository";

class ProposalsService {

  async getJobProposals(jobId: string, userId: string) {

    const job = await proposalsRepository.getJob(jobId);

    const profile = await proposalsRepository.getProfile(userId);

    if (!job || !profile) {
      throw new Error("Invalid request");
    }

    if (job.brand_id !== profile.id) {
      throw new Error("Forbidden");
    }

    return proposalsRepository.getJobProposals(jobId);
  }

  async createProposal(userId: string, jobId: string, payload: any) {

    const profile = await proposalsRepository.getProfile(userId);

    if (!profile || profile.role !== "creator") {
      throw new Error("Only creators can send proposals");
    }

    const existing = await proposalsRepository.findExistingProposal(
      jobId,
      profile.id
    );

    if (existing) {
      throw new Error("Proposal already exists");
    }

    return proposalsRepository.createProposal({
      ...payload,
      job_id: jobId,
      creator_id: profile.id
    });
  }

  async updateProposal(userId: string, proposalId: string, payload: any) {

    const proposal = await proposalsRepository.getProposal(proposalId);

    const profile = await proposalsRepository.getProfile(userId);

    if (!proposal || !profile) {
      throw new Error("Invalid request");
    }

    const job = await proposalsRepository.getJob(proposal.job_id);

    if (job.brand_id !== profile.id) {
      throw new Error("Forbidden");
    }

    return proposalsRepository.updateProposal(proposalId, payload);
  }
}

export const proposalsService = new ProposalsService();