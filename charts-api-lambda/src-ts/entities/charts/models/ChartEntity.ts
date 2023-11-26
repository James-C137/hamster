import { ChartType } from "./ChartType";

export interface ChartEntity {
  userId: string;
  chartId?: string;
  type?: ChartType;
  query?: string;
}
