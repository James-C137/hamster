import { Paper, Text } from '@mantine/core';
import { z } from 'zod';
import { chartTypesParser } from './ChartConstants';
import { LineChart, lineChartDataParser } from './LineChart';

export const chartFactoryPropsParser = z.object({
  title: z.string(),
  type: chartTypesParser,
  data: z.any()
});

export type IChartFactoryProps = z.infer<typeof chartFactoryPropsParser>;

/**
 * Creates charts with wrappers. Type of chart depends on input.
 */
export function ChartFactory(props: IChartFactoryProps) {
  props = chartFactoryPropsParser.parse(props);

  const getChart = (props: IChartFactoryProps) => {
    switch (props.type) {
      case 'empty':
        return null;
      case 'line':
        return <LineChart data={lineChartDataParser.parse([{
          id: props.title,
          data: props.data
        }])} />;
    }
  }

  return (
    <Paper radius="sm" withBorder p="md" h={{ base: 240, lg: 280, xl: 320 }}>
      <Text fw={700}>{props.title}</Text>
      { getChart(props) }
    </Paper>
  );
}
