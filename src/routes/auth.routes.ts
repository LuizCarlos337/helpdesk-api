import type { FastifyInstance } from "fastify";

import { AuthController } from "../controllers/auth.controller.js";

const authController = new AuthController();

export async function authRoutes(
    app: FastifyInstance,
) {
    app.post('/sessions', (request, reply) => {
        return authController.login(request, reply);
    })
}