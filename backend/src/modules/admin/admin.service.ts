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
  }

};