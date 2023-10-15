import { useEffect, useState } from "react";
import { TraceDAO } from "../../dataAccessObjects/TraceDAO";
import { ITraceData } from "../../models/ITraceData";
import { IChartTypes } from "../chart/ChartConstants";
import { ChartFactory } from "../chart/ChartFactory";

interface IVisualizationProps {
  title: string;
  userName: string;
  chartType: IChartTypes;
  traceId: string;
}

export function Visualization({ title, userName, chartType, traceId }: IVisualizationProps) {
  const [traceData, setTraceData] = useState<ITraceData | null>(null);

  useEffect(() => {
    const getTraceData = async () => {
      const traceData = await TraceDAO.getTrace(userName, traceId);
      setTraceData(traceData);
    }
    getTraceData();
  }, [userName, traceId]);

  return (
    <>
      {
        traceData
        ? <ChartFactory title={title} type={chartType} data={traceData} />
        : null
      }
    </>
  );
}
