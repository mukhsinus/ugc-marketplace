// backend/src/middleware/security.middleware.ts

import { FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";

export async function registerSecurityMiddleware(app: FastifyInstance) {

  await app.register(helmet, {

    global: true,

    contentSecurityPolicy: {
      directives: {
        // Default fallback for all unspecified directives
        defaultSrc: ["'self'"],

        // Scripts: Only from same origin (no inline scripts)
        scriptSrc: ["'self'"],

        // Styles: Only from same origin and CDNs (Tailwind, shadcn uses CSS modules)
        styleSrc: ["'self'", "https:", "data:"],

        // Images: Allow data URIs, HTTPS, and same origin
        imgSrc: ["'self'", "data:", "https:"],

        // API connections: Only to same origin and HTTPS
        connectSrc: ["'self'", "https:"],

        // Fonts: Allow from same origin and HTTPS
        fontSrc: ["'self'", "https:", "data:"],

        // Media: Allow from same origin and HTTPS
        mediaSrc: ["'self'", "https:"],

        // Objects: Disable (no Flash, etc)
        objectSrc: ["'none'"],

        // Frames: Prevent clickjacking
        frameAncestors: ["'none'"],

        // Base URI: Restrict to same origin
        baseUri: ["'self'"],

        // Form submissions: Only to same origin
        formAction: ["'self'"],

        // Frame embedding: No one can embed us
        frameSrc: ["'none'"],

        // Child sources (frames, workers, etc)
        childSrc: ["'self'"],

        // Worker sources
        workerSrc: ["'self'", "blob:"]
      }
    },

    // Allow cross-origin style/script loading (needed for CDNs)
    crossOriginEmbedderPolicy: false,

    // Strict HSTS to force HTTPS
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },

    // Prevent MIME sniffing
    noSniff: true,

    // Prevent clickjacking
    frameguard: {
      action: 'deny'
    },

    // Disable X-Powered-By header
    hidePoweredBy: true

  });

}