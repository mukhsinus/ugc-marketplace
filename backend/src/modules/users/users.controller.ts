// backend/src/modules/users/users.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { supabaseAdmin } from "../../config/supabase";
import { success, failure } from "../../utils/apiResponse";

export async function getMe(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {

    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send(
        failure("Unauthorized")
      );
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return reply.status(400).send(
        failure(error.message)
      );
    }

    return reply.send(
      success(data)
    );

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
) {
  try {

    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send(
        failure("Unauthorized")
      );
    }

    const updates = request.body as any;

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return reply.status(400).send(
        failure(error.message)
      );
    }

    return reply.send(
      success(data)
    );

  } catch (err) {

    request.log.error(err);

    return reply.status(500).send(
      failure("Internal server error")
    );

  }
}