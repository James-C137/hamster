import { z } from 'zod';

export const traceDataParser = z.object({
  title: z.string(),
  data: z.object({
    x: z.union([z.number(), z.string()]),
    y: z.union([z.number(), z.string()])
  }).array()
});

export type ITraceData = z.infer<typeof traceDataParser>;
