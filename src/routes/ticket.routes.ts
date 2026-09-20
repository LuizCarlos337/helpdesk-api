import type { FastifyInstance } from 'fastify'

import { TicketController } from '../controllers/ticket.controller.js'
import { authenticate } from '../middlewares/authenticate.js'
import { authorize } from '../middlewares/authorize.js'

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

  app.patch(
  '/tickets/:id/assign',
  {
    preHandler: [
      authenticate,
      authorize('ADMIN'),
    ],
  },
  (request, reply) => {
    return ticketController.assign(
      request,
      reply,
    )
  },
)

  app.get(
  '/tickets/:id',
  {
    preHandler: authenticate,
  },
  (request, reply) => {
    return ticketController.show(
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