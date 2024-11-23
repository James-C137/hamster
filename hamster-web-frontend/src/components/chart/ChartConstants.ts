import { z } from 'zod';

export const chartTypesParser = z.enum(['empty', 'line', 'scatter', 'bar', 'calendar']);

export type IChartTypes = z.infer<typeof chartTypesParser>;
