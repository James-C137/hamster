import { ChartType } from '../../../../charts-service-api/src/database-entities/charts/ChartType'
import { QueryType } from '../../../../logs-service-api/src/database-entities/logs/QueryType';
import { IChartTypes } from '../chart/ChartConstants';

export type Shortcut = {
    title: string;
    type: QueryType;
    subtext: string;
    exampleLink: string;
    chartType: ChartType
  }
  

export const shortcutTypes: Array<Shortcut> = [
//   {
//     title: 'Log Time',
//     type: 'LOG_TIME',
//     subtext: 'What time did you do something?',
//     exampleLink: 'https://www.icloud.com/shortcuts/3c6586a381d24b4e9579ed64c494c033',
//     chartType: 'SCATTER'
//   },
    {
    title: 'Counter',
    type: 'COUNTER',
    subtext: 'Keep track of how many times you do something in a day.',
    exampleLink: 'https://www.icloud.com/shortcuts/3c6586a381d24b4e9579ed64c494c033',
    chartType: 'BAR'
  },
  {
    title: 'Quantity',
    type: 'QUANTITY',
    subtext: 'Log your own quantities (e.g. how much you weigh)',
    exampleLink: 'https://www.icloud.com/shortcuts/d03bd22f86be4eb181a596a93a352445',
    chartType: 'LINE'
  }
];

export function APIChartTypeToChartLibraryChartType(apiChartType: ChartType | undefined): IChartTypes {
    switch (apiChartType)  {
        case 'LINE':
            return 'line'
        case 'SCATTER':
            return 'scatter'
        case 'BAR':
            return 'bar'
        default:
            return 'empty'
    }
}

export function APIChartTypeToDataProcessing(apiChartType: IChartTypes, timeRange: number, data: any) {
    // remove any data points more than timeRange days old
    const currentDate = new Date();
    const filteredData = data.filter((point: any[]) => {
        const timestamp = point[0];
        const dateObject = new Date(timestamp);

        const timeDiff = Math.abs(currentDate.getTime() - dateObject.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        return diffDays <= timeRange;
    });

    switch (apiChartType) {
        case 'line':
            // currently x will be the date and y will be the time (local)
            return filteredData.map((point: any[]) => {
                const timestamp = point[0];
                const value = point[1];
                const dateObject = new Date(timestamp);
                const localDate = dateObject.toLocaleDateString(); // Format: MM/DD/YYYY (varies depending on the locale)
                const localTime = dateObject.toLocaleTimeString(); // Format: HH:MM:SS AM/PM (varies depending on the locale)
                
                return {
                    "x": localDate + ' ' + localTime,
                    "y": value //dateObject
                }
            })
        case 'scatter':
        case 'bar':
            return filteredData.map((point: any[]) => {
                const timestamp = point[0];
                const dateObject = new Date(timestamp);
                const localDate = dateObject.toLocaleDateString(); // Format: MM/DD/YYYY (varies depending on the locale)
                const localTime = dateObject.toLocaleTimeString(); // Format: HH:MM:SS AM/PM (varies depending on the locale)
                
                return {
                    "x": localDate,
                    "y": localTime//dateObject
                }
            })
    }
}