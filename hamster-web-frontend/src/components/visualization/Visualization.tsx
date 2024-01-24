import { useEffect, useState } from "react";
import { TraceDAO } from "../../dataAccessObjects/TraceDAO";
import { ITraceData } from "../../models/ITraceData";
import { IChartTypes } from "../chart/ChartConstants";
import { ChartFactory } from "../chart/ChartFactory";

interface IVisualizationProps {
  title: string;
  chartType: IChartTypes;
  data: any;
}

export function Visualization({ title, chartType, data }: IVisualizationProps) {
  console.log('data');
  console.log(data);
  return (
    <ChartFactory title={title} type={chartType} data={data} />
  );
}

