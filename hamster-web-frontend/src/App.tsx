import { Loader, MantineProvider, SimpleGrid } from '@mantine/core';
import '@mantine/core/styles.css';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { ChartWithLogs } from '../../charts-service-api/src/api-schema/getChartsApiSchema';
import './App.css';
import { ChartsClient } from './clients/ChartsClient';
import { Shell } from './components/layout/Shell';
import { APIChartTypeToChartLibraryChartType, APIChartTypeToDataProcessing } from './components/layout/ShortcutTypes';
import { Visualization } from './components/visualization/Visualization';
import Calendar from './components/chart/MinimalCalendar';

function App() {
  const [username, setUsername] = useState(Cookies.get('username'));
  const [timeRange, setTimeRange] = useState(7);
  const [showLoadingIcon, setShowLoadingIcon] = useState(false);
  const [chartsData, setChartsData] = useState<ChartWithLogs[]>([]);
  const [charts, setCharts] = useState<JSX.Element[]>([]);

  const handleDelete = async (index: number) => {
    try {
      const chartToDelete = chartsData[index];
      await ChartsClient.deleteChart(username!, chartToDelete.chartId);
      const newChartsData = chartsData.filter((_, i) => i !== index);
      setChartsData(newChartsData);
    } catch (error) {
      console.error("Error deleting chart:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setShowLoadingIcon(true);
      if (!username?.length) {
        setChartsData([]);
        setShowLoadingIcon(false);
        return;
      }
    
      try {
        const charts = await ChartsClient.getCharts(username);
        setChartsData(charts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setShowLoadingIcon(false);
      }
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    const responseCharts = chartsData.map((chart, i) => {
      const chartType = APIChartTypeToChartLibraryChartType(chart.chartType);
      return (
        <Visualization
          key={i}
          title={chart.logs.eventName}
          chartType={chartType}
          data={APIChartTypeToDataProcessing(chartType, timeRange, chart.logs.data)}
          onDelete={() => handleDelete(i)}
        />
      );
    });
    
    setCharts(responseCharts);
  }, [chartsData, timeRange]);

  const chartsGrid = (
    <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }} spacing="xs">
      {charts}
    </SimpleGrid>
  );

  const highlightedDates: Date[] = [
    new Date(2024, 3, 22), // April 22, 2024
    new Date(2024, 3, 21)  // April 15, 2024
  ];

  return (
    <MantineProvider>
      <Shell
        onUsernameChange={(username: string) => {
          setUsername(username);
          Cookies.set('username', username);
        }}
        onTimeRangeChange={(timeRange: number) => setTimeRange(timeRange)}
      >
        {showLoadingIcon ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}>
            <Loader color="blue" size="xl" />
          </div>
        ) : charts.length > 0 ? (
          chartsGrid
        ) : (
          <>
           <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}>
            Click the plus icon to make your first chart!
          </div>
          </>
         
        )}
      </Shell>
    </MantineProvider>
  );
}

export default App;