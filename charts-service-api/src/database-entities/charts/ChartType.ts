import { z } from 'zod';

export const chartTypeSchema = z.enum([
  'LINE'
]);

export type ChartType = z.infer<typeof chartTypeSchema>
