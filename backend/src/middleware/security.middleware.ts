// backend/src/middleware/security.middleware.ts
// backend/src/middleware/security.middleware.ts

import { FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";

export async function registerSecurityMiddleware(app: FastifyInstance) {

  await app.register(helmet, {

    global: true,

    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"]
      }
    },

    crossOriginEmbedderPolicy: false,

    hsts: {
      maxAge: 15552000,
      includeSubDomains: true
    }

  });

}