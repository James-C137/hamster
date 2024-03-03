import { Paper, Text } from '@mantine/core';
import { z } from 'zod';
import { chartTypesParser } from './ChartConstants';
import { LineChart, lineChartDataParser } from './LineChart';
import DateTimeScatterPlot from './DateTimeScatterPlot';

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
        // return <LineChart data={lineChartDataParser.parse([{
        //   id: props.title,
        //   data: props.data
        // }])} />;
        const dates = ['3/3/2024', '3/4/2024', '3/5/2024'];
        const times = ['3:27:26 PM', '4:30:00 PM', '2:15:45 PM'];

        return <DateTimeScatterPlot x={dates} y={times} />
    }
  }

  return (
    <Paper radius="sm" withBorder p="md" h={{ base: 240, lg: 280, xl: 320 }}>
      <Text fw={700}>{props.title}</Text>
      { getChart(props) }
    </Paper>
  );
}
