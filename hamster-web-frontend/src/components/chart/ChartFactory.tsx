import { Paper, Text } from '@mantine/core';
import { z } from 'zod';
import { chartTypesParser } from './ChartConstants';
import DateTimeScatterPlot from './DateTimeScatterPlot';
import LineChart from './LineChart';


const dataPointSchema = z.object({
  x: z.string(), // Expecting a date string for x
  y: z.string() // y can be either a time string or a value
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
  console.log('props');
  console.log(props);
  console.log(props.data.map(data => data.x))
  props = chartFactoryPropsParser.parse(props);


  const getChart = (props: IChartFactoryProps) => {
    switch (props.type) {
      case 'empty':
        return null;
      case 'scatter':
        const dates = props.data.map(data => data.x);
        const times = props.data.map(data => data.y);

        return <DateTimeScatterPlot x={dates} y={times} />
      case 'line':
        const x = props.data.map(data => data.x);
        const y = props.data.map(data => data.y);

        return <LineChart x={x} y={y} title={'test'} />
    }
  }

  return (
    <Paper radius="sm" withBorder p="md" h={{ base: 290, lg: 330, xl: 410 }}>
      <Text fw={700}>{props.title}</Text>
      { getChart(props) }
    </Paper>
  );
}
