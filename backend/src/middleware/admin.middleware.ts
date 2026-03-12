// backend/src/middleware/admin.middleware.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { supabaseAdmin } from "../config/supabase";

export async function adminMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const userId = request.user?.id;

  if (!userId) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    return reply.status(403).send({ error: "Access denied" });
  }

  if (profile.role !== "admin") {
    return reply.status(403).send({ error: "Admin access required" });
  }

}