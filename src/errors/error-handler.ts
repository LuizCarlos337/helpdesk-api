import type {
    FastifyError,
    FastifyReply,
    FastifyRequest,
} from 'fastify';
import { ZodError } from 'zod';
import { AppError } from './app-error.js';

export function errorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply,
) {
    if(error instanceof ZodError) {
        return reply.status(400).send({
            message: 'Validation error',
            issues: error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        })
    }

    if(error instanceof AppError) {
        return reply.status(error.statusCode).send({
            message: error.message,
        })
    }

    request.log.error(error);

    return reply.status(500).send({
        message: 'Internal server error',
    })
}