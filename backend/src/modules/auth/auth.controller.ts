// backend/src/modules/auth/auth.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { authService } from "./auth.service";

export async function getCurrentUser(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {

    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({
        error: "Unauthorized"
      });
    }

    const profile = await authService.getCurrentUser(userId);

    return reply.send(profile);

  } catch (err) {

    request.log.error(err);

    return reply.status(500).send({
      error: "Internal server error"
    });

  }

}

export async function logout(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {

    await authService.logout();

    return reply.send({
      success: true
    });

  } catch (err) {

    request.log.error(err);

    return reply.status(500).send({
      error: "Logout failed"
    });

  }

}