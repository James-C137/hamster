import { MantineProvider, SimpleGrid } from '@mantine/core';
import '@mantine/core/styles.css';
import { ReactNode, useState } from 'react';
import './App.css';
import { Shell } from './components/layout/Shell';
import { Visualization } from './components/visualization/Visualization';

// const chartFactoryData: IChartFactoryData = {
//   chartType: 'line',
//   chartData: data
// }

function App() {
  const [userName, setUserName] = useState('james_c137');
  const [visualizations, setVisualizations] = useState(['weight', 'workout', 'calories', 'creatine', 'smth else']);

  const renderCharts = () => {
    const charts: ReactNode[] = [];
    visualizations.forEach(visualization => {
      charts.push(
        <Visualization title={visualization} userName={userName} chartType={''} traceId={''} />
      );
    });
    return charts;
  }

  return (
    <MantineProvider>
      <Shell>
        <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }} spacing="xs" >
          { renderCharts() }
        </SimpleGrid>
      </Shell>
    </MantineProvider>
  )
}

export default App;
