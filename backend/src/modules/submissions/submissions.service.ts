// backend/src/modules/submissions/submissions.service.ts
import { submissionsRepository } from "./submissions.repository";

class SubmissionsService {

  async getJobSubmissions(userId: string, jobId: string) {

    const job = await submissionsRepository.getJob(jobId);
    const profile = await submissionsRepository.getProfile(userId);

    if (!job || !profile) {
      throw new Error("Invalid request");
    }

    const acceptedCreator = await submissionsRepository.getAcceptedCreator(jobId);

    const isParticipant =
      job.brand_id === profile.id ||
      acceptedCreator?.creator_id === profile.id;

    if (!isParticipant) {
      throw new Error("Forbidden");
    }

    return submissionsRepository.getSubmissions(jobId);
  }

  async createSubmission(userId: string, payload: any) {

    const profile = await submissionsRepository.getProfile(userId);

    if (!profile || profile.role !== "creator") {
      throw new Error("Only creators can submit work");
    }

    const acceptedCreator = await submissionsRepository.getAcceptedCreator(payload.job_id);

    if (!acceptedCreator || acceptedCreator.creator_id !== profile.id) {
      throw new Error("Not assigned to this job");
    }

    return submissionsRepository.createSubmission({
      ...payload,
      creator_id: profile.id
    });
  }

  async updateSubmission(userId: string, submissionId: string, payload: any) {

    const submission = await submissionsRepository.getSubmission(submissionId);

    const profile = await submissionsRepository.getProfile(userId);

    if (!submission || !profile) {
      throw new Error("Invalid request");
    }

    const job = await submissionsRepository.getJob(submission.job_id);

    if (job.brand_id !== profile.id) {
      throw new Error("Only brand owner can review submissions");
    }

    const updated = await submissionsRepository.updateSubmission(
      submissionId,
      payload
    );

    if (payload.status === "approved") {
      await submissionsRepository.completeJob(submission.job_id);
    }

    return updated;
  }
}

export const submissionsService = new SubmissionsService();