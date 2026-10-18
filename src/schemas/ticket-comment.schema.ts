import { z } from 'zod'

export const createTicketCommentSchema = z.object({
  content: z.string().trim().min(1).max(5000),
})

export type CreateTicketCommentInput =
  z.infer<typeof createTicketCommentSchema>