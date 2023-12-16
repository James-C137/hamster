import { z } from 'zod';

export const getChartsRequestQueryStringsSchema = z.object({
  ownerId: z.string()
})

export type GetChartsRequestQueryStrings = z.infer<typeof getChartsRequestQueryStringsSchema>
