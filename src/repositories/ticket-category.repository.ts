import { prisma } from '../lib/prisma.js'

interface CreateTicketCategoryData {
  name: string
  description: string | null
}

export class TicketCategoryRepository {
  async findByName(name: string) {
    return prisma.ticketCategory.findUnique({
      where: {
        name,
      },
    })
  }

  async findById(id: string) {
    return prisma.ticketCategory.findUnique({
      where: {
        id,
      },
    })
  }

  async create(data: CreateTicketCategoryData) {
    return prisma.ticketCategory.create({
      data,
    })
  }

  async findMany() {
    return prisma.ticketCategory.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
  }
}