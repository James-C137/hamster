import { z } from 'zod';

export const postLogsRequestQueryStringParametersSchema = z.object({
  ownerId: z.string(),
  eventName: z.string()
});

export type PostLogsRequestQueryStringParameters = z.infer<typeof postLogsRequestQueryStringParametersSchema>;

export const postLogsRequestBodySchema = z.object({
  data: z.string()
})

export type PostLogsRequestBody = z.infer<typeof postLogsRequestBodySchema>
