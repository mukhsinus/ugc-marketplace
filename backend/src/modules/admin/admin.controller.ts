// backend/src/modules/admin/admin.controller.ts

import { FastifyRequest, FastifyReply } from "fastify";
import { adminService } from "./admin.service";

export async function getUsers(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const users = await adminService.getUsers();

  return reply.send({
    data: users
  });

}


export async function banUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  const user = await adminService.banUser(request.params.id);

  return reply.send({
    data: user
  });

}


export async function unbanUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  const user = await adminService.unbanUser(request.params.id);

  return reply.send({
    data: user
  });

}


export async function getPayouts(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const payouts = await adminService.getPayouts();

  return reply.send({
    data: payouts
  });

}


export async function approvePayout(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  const payout = await adminService.approvePayout(request.params.id);

  return reply.send({
    data: payout
  });

}


export async function rejectPayout(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  const payout = await adminService.rejectPayout(request.params.id);

  return reply.send({
    data: payout
  });

}


export async function getJobs(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const jobs = await adminService.getJobs();

  return reply.send({
    data: jobs
  });

}


export async function deleteJob(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  const job = await adminService.deleteJob(request.params.id);

  return reply.send({
    data: job
  });

}


// ---------------------------
// ADMIN DASHBOARD
// ---------------------------

export async function getDashboard(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const dashboard = await adminService.getDashboard();

  return reply.send({
    data: dashboard
  });

}


// ---------------------------
// PLATFORM SETTINGS
// ---------------------------

export async function updateCommission(
  request: FastifyRequest<{ Body: { value: string } }>,
  reply: FastifyReply
) {

  const result = await adminService.updateCommission(request.body.value);

  return reply.send({
    data: result
  });

}