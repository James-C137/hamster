import { z } from 'zod';

export const deleteChartRequestQueryStringSchema = z.object({
  ownerId: z.string()
});

export type DeleteChartRequestQueryString = z.infer<typeof deleteChartRequestQueryStringSchema>;
