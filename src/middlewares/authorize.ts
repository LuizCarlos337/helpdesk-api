import type {
  FastifyReply,
  FastifyRequest,
} from 'fastify'

import type { UserRole } from '../generated/prisma/enums.js'

export function authorize(...allowedRoles: UserRole[]) {
  return async function (
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { role } = request.user

    if (!allowedRoles.includes(role as UserRole)) {
      return reply.status(403).send({
        message: 'Forbidden',
      })
    }
  }
}