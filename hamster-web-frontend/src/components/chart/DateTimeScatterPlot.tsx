import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import moment from 'moment';
import 'chart.js/auto';
import 'chartjs-adapter-moment';

interface DateTimeScatterPlotProps {
  x: string[];
  y: string[];
}

interface DataPoint {
  x: number;
  y: number;
}

const DateTimeScatterPlot: React.FC<DateTimeScatterPlotProps> = ({ x, y }) => {
  const dataPoints = x.map((date, index) => {
    const xValue: number = moment(date, "MM/DD/YYYY").valueOf();
  
    const timeParts = y[index].match(/(\d+):(\d+):(\d+) (\w+)/);
    if (!timeParts) throw new Error("Invalid time format");
    let [, hours, minutes, seconds, ampm] = timeParts;
    let totalSeconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
    if (ampm.toUpperCase() === 'PM' && parseInt(hours, 10) < 12) {
      totalSeconds += 12 * 3600;
    } else if (ampm.toUpperCase() === 'AM' && parseInt(hours, 10) === 12) {
      totalSeconds -= 12 * 3600;
    }
  
    return { x: xValue, y: totalSeconds };
  });

  const data: ChartData<'scatter'> = {
    datasets: [{
      label: 'Date and Time Scatterplot',
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      data: dataPoints,
    }],
  };

  const options: ChartOptions<'scatter'> = {
    scales: {
      x: {
        type: 'time',
        time: {
          parser: 'MM/DD/YYYY',
          tooltipFormat: 'MM/DD/YYYY',
          unit: 'day',
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
        ticks: {
          stepSize: 3600, // Show a tick for every hour
          callback: (value) => {
            const totalSeconds = value as number;
            const hours24 = Math.floor(totalSeconds / 3600);
            const hours = hours24 % 12 === 0 ? 12 : hours24 % 12;
            const ampm = hours24 < 12 ? 'AM' : 'PM';
            return `${hours}:00 ${ampm}`;
          },
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'scatter'>) => {
            const point = context.raw as DataPoint;
            const dateLabel = moment(point.x).format('MM/DD/YYYY');
            const totalSeconds = point.y;
            const hours24 = Math.floor(totalSeconds / 3600);
            const hours = hours24 % 12 === 0 ? 12 : hours24 % 12;
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const ampm = hours24 < 12 ? 'AM' : 'PM';
            const timeLabel = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
            return `${dateLabel} ${timeLabel}`;
          },
        },
      },
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Date and Time Scatterplot',
      },
    },
  };

  return <Scatter data={data} options={options} />;
};

export default DateTimeScatterPlot;
