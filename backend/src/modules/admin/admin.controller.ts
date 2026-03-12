// backend/src/modules/admin/admin.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { adminService } from "./admin.service";


export async function getUsers(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const users = await adminService.getUsers();

  return reply.send(users);

}


export async function banUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  const user = await adminService.banUser(request.params.id);

  return reply.send(user);

}


export async function unbanUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  const user = await adminService.unbanUser(request.params.id);

  return reply.send(user);

}


export async function getPayouts(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const payouts = await adminService.getPayouts();

  return reply.send(payouts);

}


export async function approvePayout(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  const payout = await adminService.approvePayout(request.params.id);

  return reply.send(payout);

}


export async function rejectPayout(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  const payout = await adminService.rejectPayout(request.params.id);

  return reply.send(payout);

}


export async function getJobs(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const jobs = await adminService.getJobs();

  return reply.send(jobs);

}


export async function deleteJob(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  const job = await adminService.deleteJob(request.params.id);

  return reply.send(job);

}