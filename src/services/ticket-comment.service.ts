import type { UserRole } from '../generated/prisma/enums.js'
import { AppError } from '../errors/app-error.js'
import { TicketRepository } from '../repositories/ticket.repository.js'
import { TicketCommentRepository } from '../repositories/ticket-comment.repository.js'

export class TicketCommentService {
  constructor(
    private readonly ticketRepository =
      new TicketRepository(),

    private readonly commentRepository =
      new TicketCommentRepository(),
  ) {}

  private async getAccessibleTicket(
    ticketId: string,
    userId: string,
    role: UserRole,
  ) {
    const ticket =
      await this.ticketRepository.findById(ticketId)

    if (!ticket) {
      throw new AppError('Ticket not found', 404)
    }

    const canAccess =
      role === 'ADMIN' ||
      (role === 'USER' &&
        ticket.creatorId === userId) ||
      (role === 'TECHNICIAN' &&
        ticket.technicianId === userId)

    if (!canAccess) {
      throw new AppError('Ticket not found', 404)
    }

    return ticket
  }

  async create(
    ticketId: string,
    authorId: string,
    role: UserRole,
    content: string,
  ) {
    const ticket = await this.getAccessibleTicket(
      ticketId,
      authorId,
      role,
    )

    if (ticket.status === 'CLOSED') {
      throw new AppError(
        'Cannot comment on a closed ticket',
        409,
      )
    }

    return this.commentRepository.create(
      ticketId,
      authorId,
      content,
    )
  }

  async list(
    ticketId: string,
    userId: string,
    role: UserRole,
  ) {
    await this.getAccessibleTicket(
      ticketId,
      userId,
      role,
    )

    return this.commentRepository.findManyByTicketId(
      ticketId,
    )
  }
}