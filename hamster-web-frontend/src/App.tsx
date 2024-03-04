import { MantineProvider, SimpleGrid, TextInput } from '@mantine/core';
import '@mantine/core/styles.css';
import { useEffect, useState } from 'react';
import { ChartWithLogs } from '../../charts-service-api/src/api-schema/getChartsApiSchema';
import './App.css';
import { ChartsClient } from './clients/ChartsClient';
import { Shell } from './components/layout/Shell';
import { Visualization } from './components/visualization/Visualization';
import { IChartTypes } from './components/chart/ChartConstants';
import Cookies from 'js-cookie';
import { APIChartTypeToChartLibraryChartType, APIChartTypeToDataProcessing } from './components/layout/ShortcutTypes';

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [username, setUsername] = useState(Cookies.get('username'));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [visualizations, setVisualizations] = useState(['weight', 'workout', 'calories', 'creatine', 'smth else']);
  const [axiosVisualizations, setAxiosVisualizations] = useState([]);

  const [charts, setCharts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`username: ${username}`);
      if (username == null || username.length == 0) {
        return;
      }
    
      try {
        const charts = await ChartsClient.getCharts(username);

        let responseCharts: JSX.Element[] = [];
      
        let i = 0;
        charts.forEach((chart: ChartWithLogs) => {
          // console.log(chart.logs)
          const chartType = APIChartTypeToChartLibraryChartType(chart.chartType);
          console.log('chart.logs.data', APIChartTypeToDataProcessing(chartType, chart.logs.data));
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
  }, [username]); // Empty dependency array ensures this runs once on mount

  return (
    <MantineProvider>
      <Shell onUsernameChange={(username: string) => {
        console.log(`setting username to ${username}`);
        setUsername(username);
        Cookies.set('username', username);
      }}>
        <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }} spacing="xs" >
          { charts }
        </SimpleGrid>
      </Shell>
    </MantineProvider>
  )
}

export default App;
