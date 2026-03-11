// backend/src/modules/jobs/jobs.service.ts
import { jobsRepository } from "./jobs.repository";

class JobsService {

  async getOpenJobs() {
    return jobsRepository.getOpenJobs();
  }

  async getJobById(jobId: string) {
    return jobsRepository.getJobById(jobId);
  }

  async createJob(userId: string, payload: any) {

    const profile = await jobsRepository.getProfileByUser(userId);

    if (!profile || profile.role !== "brand") {
      throw new Error("Only brands can create jobs");
    }

    return jobsRepository.createJob({
      ...payload,
      brand_id: profile.id,
    });
  }

  async updateJob(jobId: string, userId: string, payload: any) {

    const profile = await jobsRepository.getProfileByUser(userId);

    const job = await jobsRepository.getJobById(jobId);

    if (!job || job.brand_id !== profile?.id) {
      throw new Error("Forbidden");
    }

    return jobsRepository.updateJob(jobId, payload);
  }
}

export const jobsService = new JobsService();