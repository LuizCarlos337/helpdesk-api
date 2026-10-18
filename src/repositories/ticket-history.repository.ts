import { prisma } from '../lib/prisma.js'

export class TicketHistoryRepository {
  async findManyByTicketId(ticketId: string) {
    return prisma.ticketHistory.findMany({
      where: { ticketId },

      include: {
        actor: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },

      orderBy: [
        { createdAt: 'asc' },
        { id: 'asc' },
      ],
    })
  }
}