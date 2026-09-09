import { AppError } from '../errors/app-error.js'
import { TicketCategoryRepository } from '../repositories/ticket-category.repository.js'
import type { CreateTicketCategoryInput } from '../schemas/ticket-category.schema.js'

export class TicketCategoryService {
  constructor(
    private readonly ticketCategoryRepository =
      new TicketCategoryRepository(),
  ) {}

  async create({
    name,
    description,
  }: CreateTicketCategoryInput) {
    const existingCategory =
      await this.ticketCategoryRepository.findByName(name)

    if (existingCategory) {
      throw new AppError(
        'Ticket category already exists',
        409,
      )
    }

    return this.ticketCategoryRepository.create({
      name,
      description: description ?? null,
    })
  }

  async list() {
    return this.ticketCategoryRepository.findMany()
  }
}