import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(3).max(120),

  email: z
    .string()
    .email()
    .transform((value) => value.toLowerCase()),

  password: z.string().min(8).max(72),
})

export type CreateUserInput = z.infer<typeof createUserSchema>