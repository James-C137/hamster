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
  const [axiosVisualizations, setAxiosVisualizations] = useState([]);

  const [charts, setCharts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://qiqp6ejx2c.execute-api.us-east-1.amazonaws.com/prod/charts?ownerId=james_c137');
        // Assuming the response contains an array of visualizations
        console.log(response.data);

        let responseCharts: any = [];

        // console.log(response.data.charts[0].logs);
      
        let i = 0;
        response.data.charts.forEach((chart: any) => {
          // console.log(chart.logs)
          responseCharts.push(
            <Visualization key={i} title={chart.logs.eventName} userName={chart.ownerId} chartType={APIChartTypeToChartLibraryChartType(chart.chartType)} traceId={''} />
          );
          i++;
        });
        
        setCharts(responseCharts);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <MantineProvider>
      <Shell>
        <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }} spacing="xs" >
          { charts }
        </SimpleGrid>
      </Shell>
    </MantineProvider>
  )
}

function APIChartTypeToChartLibraryChartType(apiChartType: string) {
  switch (apiChartType)  {
    case 'LINE':
      return 'line'
    default:
      return 'empty'
  }
}

export default App;
