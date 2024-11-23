import { z } from 'zod';

export const queryTypeSchema = z.enum([
  'LOG_TIME',
  'QUANTITY',
  'COUNTER',
  'DAILY_TRACKER'
]);

export type QueryType = z.infer<typeof queryTypeSchema>;
