import { Paper, Text } from '@mantine/core';
import { z } from 'zod';
import { chartTypesParser } from './ChartConstants';
import { LineChart, lineChartDataParser } from './LineChart';
import DateTimeScatterPlot from './DateTimeScatterPlot';

const dataPointSchema = z.object({
  x: z.string(), // Expecting a date string for x
  y: z.string()  // Expecting a time string for y
});

export const chartFactoryPropsParser = z.object({
  title: z.string(),
  type: chartTypesParser,
  data: z.array(dataPointSchema)
});

export type IChartFactoryProps = z.infer<typeof chartFactoryPropsParser>;

/**
 * Creates charts with wrappers. Type of chart depends on input.
 */
export function ChartFactory(props: IChartFactoryProps) {
  props = chartFactoryPropsParser.parse(props);
  console.log('props');
  console.log(props);
  console.log(props.data.map(data => data.x))

  const getChart = (props: IChartFactoryProps) => {
    switch (props.type) {
      case 'empty':
        return null;
      case 'line':
        const dates = props.data.map(data => data.x);
        const times = props.data.map(data => data.y);

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
