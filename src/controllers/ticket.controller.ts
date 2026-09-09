import type {
  FastifyReply,
  FastifyRequest,
} from 'fastify'

import { createTicketSchema, listTicketsQuerySchema } from '../schemas/ticket.schema.js'
import { TicketService } from '../services/ticket.service.js'

const ticketService = new TicketService()

export class TicketController {
  async list(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const query =
    listTicketsQuerySchema.parse(request.query)

  const result = await ticketService.list(
    request.user.sub,
    request.user.role,
    query,
  )

  return reply.send(result)
}

  async create(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const data =
      createTicketSchema.parse(request.body)

    const ticket = await ticketService.create(
      request.user.sub,
      data,
    )

    return reply.status(201).send(ticket)
  }
}