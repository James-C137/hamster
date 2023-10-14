import { Paper, Text } from '@mantine/core';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  {
    name: '1',
    weight: 4000,
  },
  {
    name: '2',
    weight: 3000,
  },
  {
    name: '3',
    weight: 2000,
  },
  {
    name: '4',
    weight: 2780,
  },
  {
    name: '5',
    weight: 1890,
  },
  {
    name: '6',
    weight: 2390,
  },
  {
    name: '7',
    weight: 3490,
  },
];

export function Graph() {
  return (
    <Paper radius="sm" withBorder p="xl">
      <Text size="md" fw={700} mb="lg">Text</Text>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="natural" dataKey="weight" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
