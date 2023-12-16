import { ChartEntity } from '../database-entities/charts/ChartEntity';

export interface GetChartsResponseBody {
  charts: ChartEntity[]
}
