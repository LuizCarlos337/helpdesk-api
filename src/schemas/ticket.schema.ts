import { z } from 'zod'

export const createTicketSchema = z.object({
  title: z.string().min(3).max(120),

  description: z.string().min(10).max(5000),

  categoryId: z.string().uuid(),

  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .optional(),
})

export type CreateTicketInput =
  z.infer<typeof createTicketSchema>

export const listTicketsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  status: z
    .enum([
      'OPEN',
      'IN_PROGRESS',
      'WAITING_USER',
      'RESOLVED',
      'CLOSED',
    ])
    .optional(),

  priority: z
    .enum([
      'LOW',
      'MEDIUM',
      'HIGH',
      'CRITICAL',
    ])
    .optional(),

  categoryId: z.string().uuid().optional(),
})

export type ListTicketsQuery =
  z.infer<typeof listTicketsQuerySchema>