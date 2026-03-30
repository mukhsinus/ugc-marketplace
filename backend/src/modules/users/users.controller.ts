// backend/src/modules/users/users.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { usersService } from "./users.service";
import { success, failure } from "../../utils/apiResponse";
import type { CurrentUserResponse, ProfileResponse } from "../../types/responses";

export async function getMe(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send(
        failure("Unauthorized")
      );
    }

    const profile: ProfileResponse = await usersService.getMyProfile(userId);
    return reply.send(success(profile));

  } catch (err) {
    request.log.error(err);
    return reply.status(500).send(
      failure("Internal server error")
    );
  }
}

export async function updateProfile(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send(
        failure("Unauthorized")
      );
    }

    const updates = request.body as any;
    const updated: ProfileResponse = await usersService.updateProfile(userId, updates);
    return reply.send(success(updated));

  } catch (err) {
    request.log.error(err);

    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    
    if (errorMessage.includes("Account") || errorMessage.includes("suspended")) {
      return reply.status(403).send(failure(errorMessage));
    }

    if (errorMessage.includes("Invalid") || errorMessage.includes("must be")) {
      return reply.status(400).send(failure(errorMessage));
    }

    return reply.status(500).send(failure("Internal server error"));
  }
}