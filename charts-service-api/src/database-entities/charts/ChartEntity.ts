import { z } from 'zod';
import { chartTypeSchema } from './ChartType';

export const chartEntitySchema = z.object({
  ownerId: z.string().min(1),
  chartId: z.string().uuid(),
  chartType: chartTypeSchema,
  queryType: z.string().min(1),
  eventName: z.string().min(1)
});

export type ChartEntity = z.infer<typeof chartEntitySchema>;
