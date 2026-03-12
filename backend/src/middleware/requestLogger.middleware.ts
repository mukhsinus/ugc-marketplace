// backend/src/middleware/requestLogger.middleware.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { randomUUID } from "crypto";

export async function requestLoggerMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const requestId = randomUUID();

  request.headers["x-request-id"] = requestId;

  const start = Date.now();

  const userId = request.user?.id || null;

  request.log.info({
    requestId,
    method: request.method,
    url: request.url,
    userId,
    ip: request.ip
  }, "incoming request");

  reply.raw.on("finish", () => {

    const duration = Date.now() - start;

    request.log.info({
      requestId,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration,
      userId
    }, "request completed");

  });

}