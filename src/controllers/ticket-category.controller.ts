import type {
  FastifyReply,
  FastifyRequest,
} from 'fastify'

import { createTicketCategorySchema } from '../schemas/ticket-category.schema.js'
import { TicketCategoryService } from '../services/ticket-category.service.js'

const ticketCategoryService =
  new TicketCategoryService()

export class TicketCategoryController {
  async create(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const data =
      createTicketCategorySchema.parse(request.body)

    const category =
      await ticketCategoryService.create(data)

    return reply.status(201).send(category)
  }

  async list(
    _request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const categories =
      await ticketCategoryService.list()

    return reply.send(categories)
  }
}