import type { FastifyInstance } from 'fastify'

import { authenticate } from '../middlewares/authenticate.js'
import { TicketHistoryController } from '../controllers/ticket-history.controller.js'

const historyController = new TicketHistoryController()

export async function ticketHistoryRoutes(
  app: FastifyInstance,
) {
  app.get(
    '/tickets/:id/history',
    {
      preHandler: authenticate,
    },
    (request, reply) =>
      historyController.list(request, reply),
  )
}