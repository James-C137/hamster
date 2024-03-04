import { z } from 'zod';
import { getLogsResponseBodySchema } from '../../../logs-service-api/src/api-schema/getLogsApiSchema';
import { chartEntitySchema } from '../database-entities/charts/ChartEntity';

export const getChartsRequestQueryStringsSchema = z.object({
  ownerId: z.string()
});

export type GetChartsRequestQueryStrings = z.infer<typeof getChartsRequestQueryStringsSchema>;

export const chartWithLogsSchema = chartEntitySchema.omit({eventName: true}).extend({
  logs: getLogsResponseBodySchema
});

export type ChartWithLogs = z.infer<typeof chartWithLogsSchema>;  // Used in frontend

export const getChartsResponseBodySchema = z.object({
  charts: chartWithLogsSchema.array()
});

export type GetChartsResponseBody = z.infer<typeof getChartsResponseBodySchema>;
