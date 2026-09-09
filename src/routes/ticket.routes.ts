import type { FastifyInstance } from 'fastify'

import { TicketController } from '../controllers/ticket.controller.js'
import { authenticate } from '../middlewares/authenticate.js'

const ticketController = new TicketController()

export async function ticketRoutes(
  app: FastifyInstance,
) {
  app.post(
    '/tickets',
    {
      preHandler: authenticate,
    },
    (request, reply) => {
      return ticketController.create(
        request,
        reply,
      )
    },
  )
  app.get(
  '/tickets',
  {
    preHandler: authenticate,
  },
  (request, reply) => {
    return ticketController.list(
      request,
      reply,
    )
  },
)
}