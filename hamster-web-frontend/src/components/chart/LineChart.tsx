import { ResponsiveLine } from '@nivo/line';
import { z } from 'zod';

export const lineChartDataParser = z.object({
  id: z.union([z.string(), z.number()]),
  data: z.object({
    x: z.union([z.number(),z.string(), z.coerce.date()]),
    y: z.union([z.number(),z.string(), z.coerce.date()])
  }).array()
}).array()

export type LineChartData = z.infer<typeof lineChartDataParser>;

export interface ILineChartProps {
  data: LineChartData;
};

export function LineChart({ data }: ILineChartProps) {
  data = lineChartDataParser.parse(data);

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 25, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: true,
          reverse: false
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'transportation',
          legendOffset: 36,
          legendPosition: 'middle'
      }}
      axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'count',
          legendOffset: -40,
          legendPosition: 'middle'
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
          {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                  {
                      on: 'hover',
                      style: {
                          itemBackground: 'rgba(0, 0, 0, .03)',
                          itemOpacity: 1
                      }
                  }
              ]
          }
      ]}
    />
  );
}
