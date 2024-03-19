import { z } from 'zod';

export const queryTypeSchema = z.enum([
  'LOG_TIME',
  'QUANTITY',
  'COUNTER'
]);

export type QueryType = z.infer<typeof queryTypeSchema>;
