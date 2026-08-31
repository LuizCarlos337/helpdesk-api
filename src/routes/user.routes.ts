import type { FastifyInstance } from "fastify";

import { UserController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const userController = new UserController();

export async function userRoutes(
    app: FastifyInstance
) {
    app.post('/users', (request, reply) =>{
        return userController.create(request, reply);
    })

    app.get('/me', {
        preHandler: authenticate,
    }, 
    (request, reply) => {
        return userController.me(request, reply);
    }
)
}