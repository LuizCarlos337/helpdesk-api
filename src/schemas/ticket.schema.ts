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