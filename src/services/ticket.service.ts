import type { TicketPriority } from '../generated/prisma/enums.js'

import { AppError } from '../errors/app-error.js'
import { TicketCategoryRepository } from '../repositories/ticket-category.repository.js'
import { TicketRepository } from '../repositories/ticket.repository.js'
import type { CreateTicketInput } from '../schemas/ticket.schema.js'

export class TicketService {
  constructor(
    private readonly ticketRepository =
      new TicketRepository(),

    private readonly ticketCategoryRepository =
      new TicketCategoryRepository(),
  ) {}

  async create(
    creatorId: string,
    {
      title,
      description,
      categoryId,
      priority,
    }: CreateTicketInput,
  ) {
    const category =
      await this.ticketCategoryRepository.findById(
        categoryId,
      )

    if (!category || !category.active) {
      throw new AppError(
        'Ticket category not found',
        404,
      )
    }

    return this.ticketRepository.create({
      title,
      description,
      categoryId,
      creatorId,
      priority:
        (priority ?? 'MEDIUM') as TicketPriority,
    })
  }
}