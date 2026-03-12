// backend/src/middleware/error.middleware.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export function registerErrorHandler(app: FastifyInstance) {

  app.setErrorHandler(
    async (error: any, request: FastifyRequest, reply: FastifyReply) => {

      request.log.error(error);

      if (error.validation) {
        return reply.status(400).send({
          error: "Validation error",
          details: error.validation
        });
      }

      if (error.statusCode) {
        return reply.status(error.statusCode).send({
          error: error.message
        });
      }

      return reply.status(500).send({
        error: "Internal server error"
      });

    }
  );

}