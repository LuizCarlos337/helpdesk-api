import type { FastifyInstance } from 'fastify'

import { TicketCategoryController } from '../controllers/ticket-category.controller.js'
import { authenticate } from '../middlewares/authenticate.js'

const ticketCategoryController =
  new TicketCategoryController()

export async function ticketCategoryRoutes(
  app: FastifyInstance,
) {
  app.post(
    '/ticket-categories',
    {
      preHandler: authenticate,
    },
    (request, reply) => {
      return ticketCategoryController.create(
        request,
        reply,
      )
    },
  )

  app.get(
    '/ticket-categories',
    {
      preHandler: authenticate,
    },
    (request, reply) => {
      return ticketCategoryController.list(
        request,
        reply,
      )
    },
  )
}