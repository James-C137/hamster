import { ChartEntity } from "../models/ChartEntity";

export interface ChartEntityDAO {
  connect: () => void;
  disconnect: () => void;
  getCharts: (ownerId: string) => Promise<ChartEntity[]>;
  postChart: (chartEntity: ChartEntity) => Promise<void>;
  deleteChart: (ownerId: string, chartId: string) => Promise<void>;
}
