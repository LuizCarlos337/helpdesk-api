import type {
  FastifyReply,
  FastifyRequest,
} from 'fastify'

import { createTicketSchema, listTicketsQuerySchema, ticketParamsSchema } from '../schemas/ticket.schema.js'
import { TicketService,  } from '../services/ticket.service.js'

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

  async show(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } =
    ticketParamsSchema.parse(request.params)

  const ticket = await ticketService.findById(
    id,
    request.user.sub,
    request.user.role,
  )

  return reply.send(ticket)
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