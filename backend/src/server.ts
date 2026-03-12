// backend/src/server.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";

import { registerRoutes } from "./routes";
import { registerErrorHandler } from "./middleware/error.middleware";
import { requestLoggerMiddleware } from "./middleware/requestLogger.middleware";
import { registerSecurityMiddleware } from "./middleware/security.middleware";
import { registerWebsocket } from "./plugins/websocket";
import { supabaseAdmin } from "./config/supabase";

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

    fastify.addHook("onRequest", requestLoggerMiddleware);

    await registerSecurityMiddleware(fastify);

    await registerWebsocket(fastify);

    await registerRoutes(fastify);

    registerErrorHandler(fastify);

    fastify.get("/health", async () => {
      return {
        status: "ok",
        service: "ugc-marketplace-api",
        timestamp: new Date().toISOString()
      };
    });

    fastify.get("/health/db", async () => {

      const { error } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .limit(1);

      if (error) {
        return {
          status: "error",
          database: "down"
        };
      }

      return {
        status: "ok",
        database: "connected"
      };

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