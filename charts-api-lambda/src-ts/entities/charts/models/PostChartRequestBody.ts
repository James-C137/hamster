import { z } from 'zod';
import { chartTypeSchema } from './ChartType';

export const postChartReqeustBodySchema = z.object({
  type: chartTypeSchema,
  query: z.string()
})

export type PostChartRequestBody = z.infer<typeof postChartReqeustBodySchema>
