import type {
  TicketPriority,
  TicketStatus,
  UserRole,
} from '../generated/prisma/enums.js'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../errors/app-error.js'

interface CreateTicketData {
  title: string
  description: string
  categoryId: string
  creatorId: string
  priority: TicketPriority
}

interface ListTicketsData {
  userId: string
  role: UserRole
  page: number
  limit: number
  status?: TicketStatus
  priority?: TicketPriority
  categoryId?: string
}
export class TicketRepository {
    
  async create(data: CreateTicketData) {
  return prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.create({
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

    await tx.ticketHistory.create({
      data: {
        ticketId: ticket.id,
        actorId: data.creatorId,
        action: 'CREATED',
        field: 'status',
        oldValue: null,
        newValue: ticket.status,
      },
    })

    return ticket
  })
}

 async updateStatus(
  ticketId: string,
  expectedStatus: TicketStatus,
  newStatus: TicketStatus,
  resolvedAt: Date | null,
  closedAt: Date | null,
  actorId: string,
) {
  return prisma.$transaction(async (tx) => {
    const result = await tx.ticket.updateMany({
      where: {
        id: ticketId,
        status: expectedStatus,
      },

      data: {
        status: newStatus,
        resolvedAt,
        closedAt,
      },
    })

    if (result.count !== 1) {
      throw new AppError(
        'Ticket status changed concurrently',
        409,
      )
    }

    await tx.ticketHistory.create({
      data: {
        ticketId,
        actorId,
        action: 'STATUS_CHANGED',
        field: 'status',
        oldValue: expectedStatus,
        newValue: newStatus,
      },
    })

    return tx.ticket.findUniqueOrThrow({
      where: { id: ticketId },

      include: {
        category: true,

        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  })
}

  async findById(id: string) {
  return prisma.ticket.findUnique({
    where: {
      id,
    },

    include: {
      category: true,

      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      technician: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },

        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })
}
  
  async assignTechnician(
  ticketId: string,
  technicianId: string,
  actorId: string,
) {
  return prisma.$transaction(async (tx) => {
    const currentTicket = await tx.ticket.findUnique({
      where: { id: ticketId },
      select: { technicianId: true },
    })

    if (!currentTicket) {
      throw new AppError('Ticket not found', 404)
    }

    if (currentTicket.technicianId === technicianId) {
      throw new AppError(
        'Technician already assigned',
        409,
      )
    }

    const ticket = await tx.ticket.update({
      where: {
        id: ticketId,
        technicianId: currentTicket.technicianId,
      },

      data: { technicianId },

      include: {
        category: true,

        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        technician: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    await tx.ticketHistory.create({
      data: {
        ticketId,
        actorId,
        action: 'TECHNICIAN_ASSIGNED',
        field: 'technicianId',
        oldValue: currentTicket.technicianId,
        newValue: technicianId,
      },
    })

    return ticket
  })
}

  async findMany({
  userId,
  role,
  page,
  limit,
  status,
  priority,
  categoryId,
}: ListTicketsData) {
  const where = {
    ...(role === 'USER'
      ? { creatorId: userId }
      : {}),

    ...(role === 'TECHNICIAN'
      ? { technicianId: userId }
      : {}),

    ...(status ? { status } : {}),

    ...(priority ? { priority } : {}),

    ...(categoryId ? { categoryId } : {}),
  }

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,

      include: {
        category: true,

        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },

      skip: (page - 1) * limit,

      take: limit,
    }),

    prisma.ticket.count({
      where,
    }),
  ])

  return {
    tickets,
    total,
  }
}
}