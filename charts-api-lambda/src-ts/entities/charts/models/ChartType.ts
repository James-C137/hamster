import { z } from 'zod';

export const chartTypeSchema = z.enum(['UNKNOWN', 'LINE'])

export type ChartType = z.infer<typeof chartTypeSchema>
