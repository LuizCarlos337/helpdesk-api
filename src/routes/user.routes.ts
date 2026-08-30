import type { FastifyInstance } from "fastify";

import { UserController } from "../controllers/user.controle.js";

const userController = new UserController();

export async function userRoutes(
    app: FastifyInstance
) {
    app.post('/users', (request, reply) =>{
        return userController.create(request, reply);
    })
}