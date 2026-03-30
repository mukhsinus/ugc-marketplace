// backend/src/modules/admin/admin.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { adminService } from "./admin.service";
import type { ProfileResponse, PayoutDetailResponse, JobWithBrandResponse, AdminDashboardResponse, PlatformSettingResponse } from "../../types/responses";

export async function getUsers(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {

    const users: ProfileResponse[] = await adminService.getUsers();

    return reply.send({ data: users });

  } catch (err) {

    request.log.error(err);

    return reply.status(500).send({
      error: "Failed to fetch users"
    });

  }
}

export async function banUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const user: ProfileResponse = await adminService.banUser(request.params.id);
    return reply.send({ data: user });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({
      error: "Failed to ban user"
    });
  }
}

export async function unbanUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const user: ProfileResponse = await adminService.unbanUser(request.params.id);
    return reply.send({ data: user });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({
      error: "Failed to unban user"
    });
  }
}

export async function getPayouts(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const payouts: PayoutDetailResponse[] = await adminService.getPayouts();
    return reply.send({ data: payouts });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({
      error: "Failed to fetch payouts"
    });
  }
}

export async function approvePayout(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const payout: PayoutDetailResponse = await adminService.approvePayout(request.params.id);
    return reply.send({ data: payout });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({
      error: "Failed to approve payout"
    });
  }
}

export async function rejectPayout(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const payout: PayoutDetailResponse = await adminService.rejectPayout(request.params.id);
    return reply.send({ data: payout });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({
      error: "Failed to reject payout"
    });
  }
}

export async function getJobs(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const jobs: JobWithBrandResponse[] = await adminService.getJobs();
    return reply.send({ data: jobs });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({
      error: "Failed to fetch jobs"
    });
  }
}

export async function deleteJob(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const job: JobWithBrandResponse = await adminService.deleteJob(request.params.id);
    return reply.send({ data: job });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({
      error: "Failed to delete job"
    });
  }
}


// DASHBOARD

export async function getDashboard(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {

  const dashboard: AdminDashboardResponse = await adminService.getDashboard();

  return reply.send({ data: dashboard });

}


// SETTINGS

export async function updateCommission(
  request: FastifyRequest<{ Body: { value: number } }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const result: any = await adminService.updateCommission(
      request.body.value
    );
    return reply.send({ data: result });
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({
      error: "Failed to update commission"
    });
  }
}