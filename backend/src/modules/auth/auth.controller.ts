// backend/src/modules/auth/auth.controller.ts

import { FastifyRequest, FastifyReply } from "fastify";
import { authService } from "./auth.service";


// ------------------------------------
// LOGIN
// ------------------------------------

export async function login(
  request: FastifyRequest<{
    Body: {
      email: string;
      password: string;
    };
  }>,
  reply: FastifyReply
) {

  try {

    const { email, password } = request.body;

    const result = await authService.login(email, password);

    return reply.send({
      data: result,
      error: null
    });

  } catch (err: any) {

    request.log.error(err);

    return reply.status(401).send({
      data: null,
      error: err.message || "Login failed"
    });

  }

}


// ------------------------------------
// SIGNUP
// ------------------------------------

export async function signup(
  request: FastifyRequest<{
    Body: {
      email: string;
      password: string;
      role: "creator" | "brand";
      name: string;
    };
  }>,
  reply: FastifyReply
) {

  try {

    const { email, password, role, name } = request.body;

    const result = await authService.signup(
      email,
      password,
      role,
      name
    );

    return reply.send({
      data: result,
      error: null
    });

  } catch (err: any) {

    request.log.error(err);

    return reply.status(400).send({
      data: null,
      error: err.message || "Signup failed"
    });

  }

}


// ------------------------------------
// CURRENT USER
// ------------------------------------

export async function getCurrentUser(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {

    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({
        data: null,
        error: "Unauthorized"
      });
    }

    const profile = await authService.getCurrentUser(userId);

    return reply.send({
      data: profile,
      error: null
    });

  } catch (err) {

    request.log.error(err);

    return reply.status(500).send({
      data: null,
      error: "Internal server error"
    });

  }

}


// ------------------------------------
// LOGOUT
// ------------------------------------

export async function logout(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {

    await authService.logout();

    return reply.send({
      data: { success: true },
      error: null
    });

  } catch (err) {

    request.log.error(err);

    return reply.status(500).send({
      data: null,
      error: "Logout failed"
    });

  }

}