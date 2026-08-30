import type {
    FastifyReply,
    FastifyRequest,
} from 'fastify';

import { loginSchema } from '../schemas/auth.schema.js';
import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export class AuthController {
    async login(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
        const data = loginSchema.parse(request.body);

        const user = await authService.authenticate(data);

        const token = await reply.jwtSign({
            sub: user.id,
            role: user.role,
        });

        return reply.send({
            accessToken: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    }
}