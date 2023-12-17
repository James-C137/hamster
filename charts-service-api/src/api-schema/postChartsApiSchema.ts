import { z } from 'zod';
import { queryTypeSchema } from '../../../logs-service-api/src/database-entities/logs/QueryType';
import { chartTypeSchema } from '../database-entities/charts/ChartType';

export const postChartRequestQueryStringsSchema = z.object({
  ownerId: z.string()
})

export type PostChartRequestQueryStrings = z.infer<typeof postChartRequestQueryStringsSchema>

export const postChartReqeustBodySchema = z.object({
  chartType: chartTypeSchema,
  queryType: queryTypeSchema,
  eventName: z.string()
})

export type PostChartRequestBody = z.infer<typeof postChartReqeustBodySchema>
