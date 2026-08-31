import type {
    FastifyReply,
    FastifyRequest,
} from 'fastify';

import { createUserSchema } from '../schemas/user.schema.js';
import { UserService } from '../services/user.service.js';

const userService = new UserService();

export class UserController {
    async create(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
        const data = createUserSchema.parse(request.body);

        const user = await userService.create(data);

        return reply.status(201).send({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        })        
    }

    async me(
        request: FastifyRequest,
        reply: FastifyReply
        ) {
        const userId = request.user.sub;

        const user = await userService.findById(userId)

    if (!user) {
        return reply.status(404).send({
        message: 'User not found',
        })
    }

    return reply.send({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt,
    })
  }
}