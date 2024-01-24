import { MantineProvider, SimpleGrid } from '@mantine/core';
import '@mantine/core/styles.css';
import { useEffect, useState } from 'react';
import { ChartWithLogs } from '../../charts-service-api/src/api-schema/getChartsApiSchema';
import './App.css';
import { ChartsClient } from './clients/ChartsClient';
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
      console.log('fetching data');
      try {
        const charts = await ChartsClient.getCharts('james_c137');

        let responseCharts: ChartWithLogs[] = [];
      
        let i = 0;
        charts.forEach((chart: any) => {
          // console.log(chart.logs)
          const chartType = APIChartTypeToChartLibraryChartType(chart.chartType);
          console.log(APIChartTypeToDataProcessing(chartType, chart.logs.data));
          responseCharts.push(
            <Visualization
              key={i}
              title={chart.logs.eventName}
              chartType={chartType}
              data={APIChartTypeToDataProcessing(chartType, chart.logs.data)}
            />
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

function APIChartTypeToDataProcessing(apiChartType: string, data: any) {
  switch (apiChartType) {
    case 'line':
      // currently x will be the date and y will be the time (local)
      return data.map((point: any[]) => {
        const timestamp = point[0];
        const dateObject = new Date(timestamp);
        const localDate = dateObject.toLocaleDateString(); // Format: MM/DD/YYYY (varies depending on the locale)
        const localTime = dateObject.toLocaleTimeString(); // Format: HH:MM:SS AM/PM (varies depending on the locale)
        
        return {
          "x": localDate,
          "y": dateObject
        }
      })
  }
}

export default App;
