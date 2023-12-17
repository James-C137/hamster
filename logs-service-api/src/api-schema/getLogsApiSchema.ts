import { z } from 'zod';
import { queryTypeSchema } from '../database-entities/logs/QueryType';

export const getLogsQueryStringParametersSchema = z.object({
  ownerId: z.string(),
  eventName: z.string(),
  queryType: queryTypeSchema
});

export type GetLogsQueryStringParameters = z.infer<typeof getLogsQueryStringParametersSchema>;

export const getLogsResponseBodySchema = z.object({
  eventName: z.string(),
  data: z.tuple([z.string(), z.string()]).array()
});

export type GetLogsResponseBody = z.infer<typeof getLogsResponseBodySchema>;
