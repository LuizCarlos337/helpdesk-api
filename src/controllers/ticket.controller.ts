import type {
  FastifyReply,
  FastifyRequest,
} from 'fastify'

import { createTicketSchema } from '../schemas/ticket.schema.js'
import { TicketService } from '../services/ticket.service.js'

const ticketService = new TicketService()

export class TicketController {
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