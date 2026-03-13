// backend/src/middleware/error.middleware.ts

import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { failure } from "../utils/apiResponse";

export function registerErrorHandler(app: FastifyInstance) {

  app.setErrorHandler(
    async (error: any, request: FastifyRequest, reply: FastifyReply) => {

      request.log.error(error);

      // Validation errors (Zod / Fastify schema)
      if (error.validation) {

        return reply.status(400).send(
          failure("Validation error")
        );

      }

      // Known application errors
      if (error.statusCode) {

        return reply.status(error.statusCode).send(
          failure(error.message)
        );

      }

      // Unknown errors
      return reply.status(500).send(
        failure("Internal server error")
      );

    }
  );

}