import { prisma } from '../lib/prisma.js'
import { AppError } from '../errors/app-error.js'

export class TicketCommentRepository {
  async create(
  ticketId: string,
  authorId: string,
  content: string,
) {
  return prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.findUnique({
      where: { id: ticketId },
      select: { status: true },
    })

    if (!ticket) {
      throw new AppError('Ticket not found', 404)
    }

    if (ticket.status === 'CLOSED') {
      throw new AppError(
        'Cannot comment on a closed ticket',
        409,
      )
    }

    const comment = await tx.ticketComment.create({
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

    await tx.ticketHistory.create({
      data: {
        ticketId,
        actorId: authorId,
        action: 'COMMENT_ADDED',
        field: 'commentId',
        oldValue: null,
        newValue: comment.id,
      },
    })

    return comment
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