// backend/src/modules/users/users.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { supabaseAdmin } from "../../config/supabase";

export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({
        error: "Unauthorized",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      return reply.status(400).send({
        error: error.message,
      });
    }

    return reply.send(data);
  } catch (err) {
    request.log.error(err);

    return reply.status(500).send({
      error: "Internal server error",
    });
  }
}

export async function updateProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({
        error: "Unauthorized",
      });
    }

    const updates = request.body as any;

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(updates)
      .eq("id", profile?.id)
      .select()
      .single();

    if (error) {
      return reply.status(400).send({
        error: error.message,
      });
    }

    return reply.send(data);
  } catch (err) {
    request.log.error(err);

    return reply.status(500).send({
      error: "Internal server error",
    });
  }
}