import { ChartType } from "./ChartType";

export interface ChartEntity {
  ownerId: string;
  chartId: string;
  type: ChartType;
  queryType: string;
  eventName: string;
}
