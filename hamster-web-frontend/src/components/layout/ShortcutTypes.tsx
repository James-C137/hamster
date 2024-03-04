import { ChartType } from '../../../../charts-service-api/src/database-entities/charts/ChartType'
import { QueryType } from '../../../../logs-service-api/src/database-entities/logs/QueryType';

export type Shortcut = {
    title: string;
    type: QueryType;
    subtext: string;
    exampleLink: string;
    chartType: ChartType
  }
  

export const shortcutTypes: Array<Shortcut> = [
  {
    title: 'Log Time',
    type: 'LOG_TIME',
    subtext: 'What time did you do something?',
    exampleLink: 'https://www.icloud.com/shortcuts/3c6586a381d24b4e9579ed64c494c033',
    chartType: 'SCATTER'
  },
  {
    title: 'Quantity',
    type: 'QUANTITY',
    subtext: 'Log quantities (e.g. how many steps you took)',
    exampleLink: 'https://www.icloud.com/shortcuts/3c6586a381d24b4e9579ed64c494c033',
    chartType: 'LINE'
  }
];