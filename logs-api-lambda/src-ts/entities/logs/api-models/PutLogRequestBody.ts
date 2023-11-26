import { z } from 'zod';

export const postLogsRequestBodySchema = z.object({
  timestamp: z.coerce.date(),
  username: z.string(),
  analysisName: z.string().optional(),
  eventName: z.string().optional(),
  data: z.string().optional()
})

export type PostLogsRequestBody = z.infer<typeof postLogsRequestBodySchema>
