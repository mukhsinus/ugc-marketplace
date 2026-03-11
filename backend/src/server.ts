// backend/src/server.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import pino from "pino";

import { registerRoutes } from "./routes";

dotenv.config();

const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});

const fastify = Fastify({
  logger,
});

async function start() {
  try {
    await fastify.register(cors, {
      origin: true,
      credentials: true,
    });

    await registerRoutes(fastify);

    fastify.get("/health", async () => {
      return { status: "ok" };
    });

    const PORT = Number(process.env.PORT) || 4000;

    await fastify.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();