// backend/src/modules/admin/admin.service.ts

import { adminRepository } from "./admin.repository";
import { payoutsService } from "../payouts/payouts.service";

export const adminService = {

  async getUsers() {
    return adminRepository.getUsers();
  },

  async banUser(userId: string) {
    return adminRepository.updateUserBan(userId, true);
  },

  async unbanUser(userId: string) {
    return adminRepository.updateUserBan(userId, false);
  },

  async getPayouts() {
    return adminRepository.getPayouts();
  },

  async approvePayout(payoutId: string) {
    return payoutsService.updatePayoutStatus(payoutId, "paid");
  },

  async rejectPayout(payoutId: string) {
    return payoutsService.updatePayoutStatus(payoutId, "rejected");
  },

  async getJobs() {
    return adminRepository.getJobs();
  },

  async deleteJob(jobId: string) {
    return adminRepository.deleteJob(jobId);
  },

  // -------------------------
  // DASHBOARD
  // -------------------------

  async getDashboard() {

    const data = await adminRepository.getDashboardData();

    const profiles = data.profiles || [];
    const jobs = data.jobs || [];

    const creators = profiles.filter(p => p.role === "creator").length;
    const brands = profiles.filter(p => p.role === "brand").length;

    const jobsCount = jobs.length;

    const completedJobs = jobs.filter(
      (j: any) => j.status === "completed"
    ).length;

    return {

      creators,
      brands,

      jobsCount,
      completedJobs,

      users: profiles,

      jobs: jobs.map((job: any) => ({
        ...job,
        brandName:
          job.profiles?.company_name ||
          job.profiles?.name ||
          null
      })),

      commission: data.commission

    };

  },

  // -------------------------
  // PLATFORM SETTINGS
  // -------------------------

  async updateCommission(value: string) {
    return adminRepository.updateCommission(value);
  }

};