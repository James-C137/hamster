import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import moment from 'moment';
import 'chart.js/auto';
import 'chartjs-adapter-moment';

interface DateTimeBarChartProps {
  x: string[]; // Dates
  y: string[]; // Times, not used directly in this component but kept for future extensions or filtering
}

interface DateCounts {
  [date: string]: number;
}

const DateTimeBarChart: React.FC<DateTimeBarChartProps> = ({ x }) => {
  // Count occurrences of each date
  const dateCounts: DateCounts = x.reduce((acc: DateCounts, date: string) => {
    const formattedDate: string = moment(date, "MM/DD/YYYY").format('MM/DD/YYYY'); // Ensure consistent formatting
    acc[formattedDate] = (acc[formattedDate] || 0) + 1;
    return acc;
  }, {});

  // Prepare chart data with type safety
  const chartData: ChartData<'bar'> = {
    labels: Object.keys(dateCounts),
    datasets: [{
      label: 'Data Points per Day',
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      data: Object.values(dateCounts),
    }],
  };

  // Options typed explicitly
  const options: ChartOptions<'bar'> = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MM/DD/YYYY',
          displayFormats: {
            day: 'MM/DD/YYYY',
          },
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Data Points',
        },
        ticks: {
            // Ensure ticks are integers by using the callback
            callback: (val: number | string) => {
                const value = Number(val);
                if (value % 1 === 0) { // Check if the value is an integer
                  return value.toString();
                }
              },
          },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Data Points per Day',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default DateTimeBarChart;
