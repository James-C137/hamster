import { Paper, Text } from '@mantine/core';
import { z } from 'zod';
import { LineChart, lineChartDataParser } from './LineChart';

export const chartFactoryDataParser = z.discriminatedUnion('chartType', [
  z.object({
    chartType: z.literal('line'),
    chartData: lineChartDataParser
  })
]);

export type ChartFactoryData = z.infer<typeof chartFactoryDataParser>;

export interface IChartFactoryProps {
  title: string;
  data: ChartFactoryData
};

/**
 * Serves as both the factory and the wrapper for all chart types.
 */
export function ChartFactory({ title, data }: IChartFactoryProps) {

  const getChart = (data: ChartFactoryData) => {
    data = chartFactoryDataParser.parse(data);

    switch (data.chartType) {
      case 'line':
        return <LineChart data={data.chartData} />
    }
  }

  return (
    <Paper radius="sm" withBorder p="md" h={{ base: 240, lg: 280, xl: 320 }}>
      <Text fw={700}>{title}</Text>
      { getChart(data) }
    </Paper>
  );
}
