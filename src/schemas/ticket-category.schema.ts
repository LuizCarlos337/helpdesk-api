import { z } from 'zod'

export const createTicketCategorySchema = z.object({
  name: z
    .string()
    .min(2)
    .max(80),

  description: z
    .string()
    .max(255)
    .optional(),
})

export type CreateTicketCategoryInput =
  z.infer<typeof createTicketCategorySchema>