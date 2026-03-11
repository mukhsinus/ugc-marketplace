// backend/src/server.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";

import { registerRoutes } from "./routes";

dotenv.config();

const fastify = Fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname"
      }
    }
  }
});

async function start() {
  try {
    await fastify.register(cors, {
      origin: true,
      credentials: true
    });

    await registerRoutes(fastify);

    fastify.get("/health", async () => {
      return { status: "ok" };
    });

    const PORT = Number(process.env.PORT) || 4000;

    await fastify.listen({
      port: PORT,
      host: "0.0.0.0"
    });

    fastify.log.info(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();