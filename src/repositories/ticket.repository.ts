import type { TicketPriority } from '../generated/prisma/enums.js'
import { prisma } from '../lib/prisma.js'

interface CreateTicketData {
  title: string
  description: string
  categoryId: string
  creatorId: string
  priority: TicketPriority
}

export class TicketRepository {
  async create(data: CreateTicketData) {
    return prisma.ticket.create({
      data,
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }
}