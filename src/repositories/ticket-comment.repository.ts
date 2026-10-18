import { prisma } from '../lib/prisma.js'

export class TicketCommentRepository {
  async create(
    ticketId: string,
    authorId: string,
    content: string,
  ) {
    return prisma.ticketComment.create({
      data: {
        ticketId,
        authorId,
        content,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    })
  }

  async findManyByTicketId(ticketId: string) {
    return prisma.ticketComment.findMany({
      where: { ticketId },

      include: {
        author: {
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