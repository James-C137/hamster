import { useEffect, useState } from "react";
import { Card, ActionIcon } from "@mantine/core";
import { Trash } from "tabler-icons-react";
import { TraceDAO } from "../../dataAccessObjects/TraceDAO";
import { ITraceData } from "../../models/ITraceData";
import { IChartTypes } from "../chart/ChartConstants";
import { ChartFactory } from "../chart/ChartFactory";

interface IVisualizationProps {
  title: string;
  chartType: IChartTypes;
  data: any;
  onDelete?: () => void;
}

export function Visualization({ title, chartType, data, onDelete }: IVisualizationProps) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <Card 
      shadow="sm"
      style={{ position: 'relative' }}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {showDelete && onDelete && (
        <ActionIcon
          style={{ 
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 10
          }}
          onClick={onDelete}
          size="sm"
        >
          <Trash size={16} />
        </ActionIcon>
      )}
      <ChartFactory title={title} type={chartType} data={data} />
    </Card>
  );
}