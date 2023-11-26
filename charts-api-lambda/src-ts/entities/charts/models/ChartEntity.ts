import { ChartType } from "./ChartType";

export interface ChartEntity {
  ownerId: string;
  chartId?: string;
  type?: ChartType;
  query?: string;
}
