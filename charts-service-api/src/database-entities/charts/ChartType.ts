import { z } from 'zod';

export const chartTypeSchema = z.enum([
  'LINE',
  'SCATTER'
]);

export type ChartType = z.infer<typeof chartTypeSchema>
