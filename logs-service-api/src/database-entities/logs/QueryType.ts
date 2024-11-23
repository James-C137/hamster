import { z } from 'zod';

export const queryTypeSchema = z.enum([
  'LOG_TIME',
  'QUANTITY',
  'COUNTER',
  'DAILY_TRACKER',
  'CUSTOM_SQL'
]);

export type QueryType = z.infer<typeof queryTypeSchema>;
