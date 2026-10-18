import type {
  FastifyReply,
  FastifyRequest,
} from 'fastify'

import { ticketParamsSchema } from '../schemas/ticket.schema.js'
import { createTicketCommentSchema } from '../schemas/ticket-comment.schema.js'
import { TicketCommentService } from '../services/ticket-comment.service.js'

const commentService = new TicketCommentService()

export class TicketCommentController {
  async create(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { id } =
      ticketParamsSchema.parse(request.params)

    const { content } =
      createTicketCommentSchema.parse(request.body)

    const comment = await commentService.create(
      id,
      request.user.sub,
      request.user.role,
      content,
    )

    return reply.status(201).send(comment)
  }

  async list(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { id } =
      ticketParamsSchema.parse(request.params)

    const comments = await commentService.list(
      id,
      request.user.sub,
      request.user.role,
    )

    return reply.send(comments)
  }
}