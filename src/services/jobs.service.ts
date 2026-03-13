// src/services/jobs.service.ts

import { api } from "@/lib/api";
import { Job } from "@/types/job";

export const jobsService = {

  async getJobs(): Promise<Job[]> {

    const response = await api.get("/jobs");

    if (!response) {
      return [];
    }

    return response.data ?? response;

  },

  async getJobById(jobId: string): Promise<Job> {

    const response = await api.get(`/jobs/${jobId}`);

    if (!response) {
      throw new Error("Job not found");
    }

    return response.data ?? response;

  },

  async createJob(data: Partial<Job>): Promise<Job> {

    const response = await api.post("/jobs", data);

    return response.data ?? response;

  },

  async updateJob(jobId: string, data: Partial<Job>): Promise<Job> {

    const response = await api.patch(`/jobs/${jobId}`, data);

    return response.data ?? response;

  }

};