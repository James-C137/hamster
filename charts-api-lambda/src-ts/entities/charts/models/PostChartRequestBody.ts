import { z } from 'zod';
import { chartTypeSchema } from './ChartType';

export const postChartReqeustBodySchema = z.object({
  type: chartTypeSchema,
  queryType: z.string(),
  eventName: z.string()
})

export type PostChartRequestBody = z.infer<typeof postChartReqeustBodySchema>
