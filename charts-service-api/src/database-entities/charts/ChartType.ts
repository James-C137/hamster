import { z } from 'zod';

export const chartTypeSchema = z.enum([
  'LINE',
  'SCATTER',
  'BAR'
]);

export type ChartType = z.infer<typeof chartTypeSchema>
