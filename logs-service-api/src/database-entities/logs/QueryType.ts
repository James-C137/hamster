import { z } from 'zod';

export const queryTypeSchema = z.enum([
  'LOG_TIME',
  'QUANTITY'
]);

export type QueryType = z.infer<typeof queryTypeSchema>;
