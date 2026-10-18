import type { UserRole } from '../generated/prisma/enums.js'
import { AppError } from '../errors/app-error.js'
import { TicketRepository } from '../repositories/ticket.repository.js'
import { TicketHistoryRepository } from '../repositories/ticket-history.repository.js'

export class TicketHistoryService {
  constructor(
    private readonly ticketRepository =
      new TicketRepository(),

    private readonly historyRepository =
      new TicketHistoryRepository(),
  ) {}

  async list(
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

    return this.historyRepository.findManyByTicketId(
      ticketId,
    )
  }
}