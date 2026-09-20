import type {
  TicketPriority,
  TicketStatus,
  UserRole,
} from '../generated/prisma/enums.js'

import { AppError } from '../errors/app-error.js'
import { TicketCategoryRepository } from '../repositories/ticket-category.repository.js'
import { TicketRepository } from '../repositories/ticket.repository.js'
import { UserRepository } from '../repositories/user.repository.js'
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

      private readonly userRepository =
    new UserRepository(),
  ) {}

  async assignTechnician(
  ticketId: string,
  technicianId: string,
) {
  const ticket =
    await this.ticketRepository.findById(ticketId)

  if (!ticket) {
    throw new AppError('Ticket not found', 404)
  }

  const technician =
    await this.userRepository.findById(technicianId)

  if (!technician) {
    throw new AppError('Technician not found', 404)
  }

  if (!technician.active) {
    throw new AppError(
      'Technician is inactive',
      400,
    )
  }

  if (technician.role !== 'TECHNICIAN') {
    throw new AppError(
      'User is not a technician',
      400,
    )
  }

  return this.ticketRepository.assignTechnician(
    ticketId,
    technicianId,
  )
}

  async findById(
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