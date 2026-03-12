// backend/src/middleware/rateLimit.middleware.ts
import { FastifyRequest, FastifyReply } from "fastify";

const requests = new Map<string, { count: number; lastRequest: number }>();

const WINDOW = 60 * 1000; // 1 minute
const LIMIT = 100; // 100 requests per minute per IP

export async function rateLimitMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const ip = request.ip;

  const now = Date.now();
  const record = requests.get(ip);

  if (!record) {
    requests.set(ip, { count: 1, lastRequest: now });
    return;
  }

  if (now - record.lastRequest > WINDOW) {
    requests.set(ip, { count: 1, lastRequest: now });
    return;
  }

  record.count++;

  if (record.count > LIMIT) {
    return reply
      .status(429)
      .send({ error: "Too many requests. Try again later." });
  }
}