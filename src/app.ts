import Fastify from 'fastify';
import jwt from '@fastify/jwt';


import { userRoutes } from './routes/user.routes.js';
import { authRoutes } from './routes/auth.routes.js';


export function buildApp() {
    const app = Fastify({
        logger: true,
    })

    const jwtSecret = process.env.JWT_SECRET;

    if(!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
    }

    app.register(jwt, {
        secret: jwtSecret,
        sign: {
            expiresIn: '15m',
        }
    })

    app.get('/health', async() => {
        return {
            status: 'ok',
            service: 'helpdesk-api',
        }
    })

    app.register(userRoutes);
    app.register(authRoutes);

    return app;
}