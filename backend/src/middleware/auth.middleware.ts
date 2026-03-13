// backend/src/middleware/auth.middleware.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { supabaseAdmin } from "../config/supabase";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send({
        error: "Missing authorization header",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return reply.status(401).send({
        error: "Invalid authorization format",
      });
    }

    const token = parts[1];

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      return reply.status(401).send({
        error: "Invalid or expired token",
      });
    }

    request.user = {
      id: data.user.id,
      email: data.user.email ?? undefined,
    };

  } catch (err) {

    request.log.error(err);

    return reply.status(500).send({
      error: "Authentication error",
    });

  }
}