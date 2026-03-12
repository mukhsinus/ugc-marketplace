// ugc-marketplace/src/services/jobs.service.ts

import { api } from "@/lib/api";
import { Job } from "@/types/job";

export const jobsService = {

  async getJobs(): Promise<Job[]> {
    const response = await api.get("/jobs");
    return response.data;
  },

  async getJobById(jobId: string): Promise<Job> {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  async createJob(data: Partial<Job>): Promise<Job> {
    const response = await api.post("/jobs", data);
    return response.data;
  },

  async updateJob(jobId: string, data: Partial<Job>): Promise<Job> {
    const response = await api.patch(`/jobs/${jobId}`, data);
    return response.data;
  }

};