// backend/src/modules/submissions/submissions.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { submissionsService } from "./submissions.service";
import {
  createSubmissionSchema,
  updateSubmissionSchema
} from "./submissions.schema";

export async function getJobSubmissions(
  request: FastifyRequest<{ Params: { jobId: string } }>,
  reply: FastifyReply
) {

  const submissions = await submissionsService.getJobSubmissions(
    request.user!.id,
    request.params.jobId
  );

  return reply.send(submissions);
}

export async function createSubmission(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const parsed = createSubmissionSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send(parsed.error);
  }

  const submission = await submissionsService.createSubmission(
    request.user!.id,
    parsed.data
  );

  return reply.status(201).send(submission);
}

export async function updateSubmission(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

  const parsed = updateSubmissionSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send(parsed.error);
  }

  const submission = await submissionsService.updateSubmission(
    request.user!.id,
    request.params.id,
    parsed.data
  );

  return reply.send(submission);
}