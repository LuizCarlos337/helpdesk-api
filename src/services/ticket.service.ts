import type {
  TicketPriority,
  TicketStatus,
  UserRole,
} from '../generated/prisma/enums.js'

import { AppError } from '../errors/app-error.js'
import { TicketCategoryRepository } from '../repositories/ticket-category.repository.js'
import { TicketRepository } from '../repositories/ticket.repository.js'
import type {
  CreateTicketInput,
  ListTicketsQuery,
} from '../schemas/ticket.schema.js'

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
  async list(
  userId: string,
  role: UserRole,
  {
    page,
    limit,
    status,
    priority,
    categoryId,
  }: ListTicketsQuery,
) {
  const { tickets, total } =
    await this.ticketRepository.findMany({
      userId,
      role,
      page,
      limit,

      ...(status
        ? { status: status as TicketStatus }
        : {}),

      ...(priority
        ? { priority: priority as TicketPriority }
        : {}),

      ...(categoryId
        ? { categoryId }
        : {}),
    })

  return {
    data: tickets,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
}