import type { FastifyInstance } from 'fastify'

import { authenticate } from '../middlewares/authenticate.js'
import { TicketCommentController } from '../controllers/ticket-comment.controller.js'

const commentController = new TicketCommentController()

export async function ticketCommentRoutes(
  app: FastifyInstance,
) {
  app.post(
    '/tickets/:id/comments',
    {
      preHandler: authenticate,
    },
    (request, reply) =>
      commentController.create(request, reply),
  )

  app.get(
    '/tickets/:id/comments',
    {
      preHandler: authenticate,
    },
    (request, reply) =>
      commentController.list(request, reply),
  )
}