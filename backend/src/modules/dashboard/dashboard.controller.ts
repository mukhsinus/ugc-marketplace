// backend/src/modules/dashboard/dashboard.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { supabaseAdmin } from "../../config/supabase";
import { success, failure } from "../../utils/apiResponse";

export async function getBrandDashboard(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {

    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send(failure("Unauthorized"));
    }

    const { count: jobs } = await supabaseAdmin
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("brand_id", userId);

    const { count: activeJobs } = await supabaseAdmin
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("brand_id", userId)
      .eq("status", "open");

    const { data: jobIds } = await supabaseAdmin
      .from("jobs")
      .select("id")
      .eq("brand_id", userId);

    const ids = jobIds?.map(j => j.id) || [];

    let proposals = 0;

    if (ids.length > 0) {
      const res = await supabaseAdmin
        .from("proposals")
        .select("*", { count: "exact", head: true })
        .in("job_id", ids);

      proposals = res.count || 0;
    }

    return reply.send(
      success({
        jobs: jobs || 0,
        activeJobs: activeJobs || 0,
        proposals
      })
    );

  } catch (err) {

    request.log.error(err);

    return reply.status(500).send(
      failure("Internal server error")
    );

  }

}

export async function getCreatorDashboard(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {

    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send(failure("Unauthorized"));
    }

    const { count: proposals } = await supabaseAdmin
      .from("proposals")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", userId);

    const { count: activeJobs } = await supabaseAdmin
      .from("proposals")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", userId)
      .eq("status", "accepted");

    return reply.send(
      success({
        proposals: proposals || 0,
        activeJobs: activeJobs || 0
      })
    );

  } catch (err) {

    request.log.error(err);

    return reply.status(500).send(
      failure("Internal server error")
    );

  }

}