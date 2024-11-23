import { Paper, Text } from '@mantine/core';
import { number, z } from 'zod';
import { chartTypesParser } from './ChartConstants';
import DateTimeScatterPlot from './DateTimeScatterPlot';
import LineChart from './LineChart';
import DateTimeBarChart from './DateTimeBarChart';
import MinimalCalendar from './MinimalCalendar'


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
  props = chartFactoryPropsParser.parse(props);

  console.log('chartFactory');
  console.log(props);


  const getChart = (props: IChartFactoryProps) => {
    switch (props.type) {
      case 'empty':
        return null;
      case 'bar':
        const dates = props.data.map(data => data.x);
        const times = props.data.map(data => data.y);

        return <DateTimeBarChart x={dates} y={times} />
      case 'line':
        const x = props.data.map(data => data.x);
        const y = props.data.map(data => data.y);

        return <LineChart x={x} y={y} title={'test'} />
      case 'calendar':
        const highlightedDates = props.data.map(data => new Date(data.x))
        return <MinimalCalendar highlightedDates={highlightedDates}/>
    }
  }

  return (
    <Paper radius="sm" withBorder p="md">
      <Text fw={700}>{props.title}</Text>
      { getChart(props) }
    </Paper>
  );
}
