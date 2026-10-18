import type {
  FastifyReply,
  FastifyRequest,
} from 'fastify'

import { ticketParamsSchema } from '../schemas/ticket.schema.js'
import { TicketHistoryService } from '../services/ticket-history.service.js'

const historyService = new TicketHistoryService()

export class TicketHistoryController {
  async list(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { id } =
      ticketParamsSchema.parse(request.params)

    const history = await historyService.list(
      id,
      request.user.sub,
      request.user.role,
    )

    return reply.send(history)
  }
}