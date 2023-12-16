import { z } from 'zod';

export const queryTypsSchema = z.enum([
  'logTime'
]);

export type QueryTypes = z.infer<typeof queryTypsSchema>;
