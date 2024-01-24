import { MantineProvider, SimpleGrid } from '@mantine/core';
import '@mantine/core/styles.css';
import { ReactNode, useState, useEffect } from 'react';
import axios from 'axios'
import './App.css';
import { Shell } from './components/layout/Shell';
import { Visualization } from './components/visualization/Visualization';

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userName, setUserName] = useState('james_c137');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [visualizations, setVisualizations] = useState(['weight', 'workout', 'calories', 'creatine', 'smth else']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://qiqp6ejx2c.execute-api.us-east-1.amazonaws.com/prod/charts?ownerId=test');
        // Assuming the response contains an array of visualizations
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once on mount

  const renderCharts = () => {
    const charts: ReactNode[] = [];
    let i = 0;
    visualizations.forEach(visualization => {
      charts.push(
        <Visualization key={i} title={visualization} userName={userName} chartType={'line'} traceId={''} />
      );
      i++;
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
