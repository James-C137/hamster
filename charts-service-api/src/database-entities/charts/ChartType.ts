import { z } from 'zod';

export const chartTypeSchema = z.enum([
  'LINE',
  'SCATTER',
  'BAR',
  'CALENDAR'
]);

export type ChartType = z.infer<typeof chartTypeSchema>
