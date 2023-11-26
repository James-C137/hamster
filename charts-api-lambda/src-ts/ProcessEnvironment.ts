import { z } from 'zod';

export const processEnvironmentSchema = z.object({
  CHARTS_TABLE_NAME: z.string()
})

export type ProcessEnvironment = z.infer<typeof processEnvironmentSchema>
