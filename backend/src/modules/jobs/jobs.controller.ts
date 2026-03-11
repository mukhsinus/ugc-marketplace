// backend/src/modules/jobs/jobs.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { jobsService } from "./jobs.service";

export async function getJobs(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const jobs = await jobsService.getOpenJobs();
  return reply.send(jobs);
}

export async function getJobById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const job = await jobsService.getJobById(request.params.id);

  if (!job) {
    return reply.status(404).send({ error: "Job not found" });
  }

  return reply.send(job);
}

export async function createJob(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user?.id;

  if (!userId) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  const job = await jobsService.createJob(userId, request.body);

  return reply.status(201).send(job);
}

export async function updateJob(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const userId = request.user?.id;

  if (!userId) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  const job = await jobsService.updateJob(
    request.params.id,
    userId,
    request.body
  );

  return reply.send(job);
}