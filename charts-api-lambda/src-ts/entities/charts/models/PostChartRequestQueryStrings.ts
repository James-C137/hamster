import { z } from 'zod';

export const postChartRequestQueryStringsSchema = z.object({
  ownerId: z.string()
})

export type PostChartRequestQueryStrings = z.infer<typeof postChartRequestQueryStringsSchema>
