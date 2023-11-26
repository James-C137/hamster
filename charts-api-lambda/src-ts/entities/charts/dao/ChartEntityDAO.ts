import { ChartEntity } from "../models/ChartEntity";

export interface ChartEntityDAO {
  connect: () => void;
  disconnect: () => void;
  getCharts: (userId: string) => Promise<ChartEntity[]>;
  postChart: (chartEntity: ChartEntity) => Promise<void>;
  deleteChart: (userId: string, chartId: string) => Promise<void>;
}
