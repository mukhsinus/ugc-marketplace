// backend/src/middleware/auth.middleware.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { supabaseAdmin } from "../config/supabase";

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

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

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return reply.status(401).send({
        error: "Invalid or expired token",
      });
    }

    request.user = {
      id: user.id,
      email: user.email,
    };
  } catch (err) {
    request.log.error(err);

    return reply.status(500).send({
      error: "Authentication error",
    });
  }
}