import { Loader, MantineProvider, SimpleGrid, TextInput } from '@mantine/core';
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
import { Plus } from 'tabler-icons-react';

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [username, setUsername] = useState(Cookies.get('username'));
  const [timeRange, setTimeRange] = useState(7);

  const [showLoadingIcon, setShowLoadingIcon] = useState(false);
  const [chartsData, setChartsData] = useState<ChartWithLogs[]>([]);
  const [charts, setCharts] = useState<any[]>([]);

  // get data every username change
  useEffect(() => {
    const fetchData = async () => {
      console.log(`username: ${username}`);
      setShowLoadingIcon(true);
      if (username == null || username.length == 0) {
        setChartsData([]);
        return;
      }
    
      try {
        
        const charts = await ChartsClient.getCharts(username);
        setChartsData(charts);
        setShowLoadingIcon(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [username]); // Empty dependency array ensures this runs once on mount

  // re-render any time data changes or date range changes
  useEffect(() => {
    let responseCharts: JSX.Element[] = [];
      
    let i = 0;
    chartsData.forEach((chart: ChartWithLogs) => {
      // console.log(chart.logs)
      const chartType = APIChartTypeToChartLibraryChartType(chart.chartType);
      console.log('chart.logs.data', APIChartTypeToDataProcessing(chartType, timeRange, chart.logs.data));
      responseCharts.push(
        <Visualization
          key={i}
          title={chart.logs.eventName}
          chartType={chartType}
          data={APIChartTypeToDataProcessing(chartType, timeRange, chart.logs.data)}
        />
      );
      i++;
    });
    
    setCharts(responseCharts);
  }, [chartsData, timeRange]);

  const chartsGrid = (
    <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }} spacing="xs" >
      { charts }
    </SimpleGrid>
  );

  return (
    <MantineProvider>
      <Shell
        onUsernameChange={(username: string) => {
          console.log(`setting username to ${username}`);
          setUsername(username);
          Cookies.set('username', username);
        }}
        
        onTimeRangeChange={(timeRange: number) => setTimeRange(timeRange)}
      >
        {
          showLoadingIcon ? <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%', // Adjust based on the Shell component's height or as needed
            width: '100%', // This ensures the centering div takes up full width
          }}>
            <Loader color='blue' size='xl' />
          </div> : charts.length > 0 ? chartsGrid : <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%', // Adjust based on the Shell component's height or as needed
            width: '100%', // This ensures the centering div takes up full width
          }}>
            Click the plus icon to make your first chart!
          </div>
        }
      </Shell>
    </MantineProvider>
  )
}

export default App;
