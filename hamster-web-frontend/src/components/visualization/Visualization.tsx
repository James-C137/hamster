import { useEffect, useState } from "react";
import { TraceDAO } from "../../dataAccessObjects/TraceDAO";
import { ChartFactory } from "../chart/ChartFactory";

interface IVisualizationProps {
  title: string;
  userName: string;
  chartType: string;
  traceId: string;
}

export function Visualization({ title, userName, chartType, traceId }: IVisualizationProps) {
  const [traceData, setTraceData] = useState<any>(null);

  useEffect(() => {
    const getTraceData = async () => {
      const traceData = await TraceDAO.getTrace(userName, traceId);
      setTraceData(traceData);
    }
    getTraceData();
  })

  return (
    <>
      {
        traceData
        ? <ChartFactory title={title} data={traceData} />
        : null
      }
    </>
  );
}
