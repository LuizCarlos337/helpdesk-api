import type {
  TicketPriority,
  TicketStatus,
  UserRole,
} from '../generated/prisma/enums.js'
import { prisma } from '../lib/prisma.js'

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