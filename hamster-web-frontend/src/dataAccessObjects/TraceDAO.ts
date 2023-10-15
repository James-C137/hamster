import { ITraceData } from "../models/ITraceData";

const mockData = [
  {
    "x": 1,
    "y": 23
  },
  {
    "x": 2,
    "y": 74
  },
  {
    "x": 3,
    "y": 152
  },
  {
    "x": 4,
    "y": 236
  },
  {
    "x": 5,
    "y": 89
  },
  {
    "x": 6,
    "y": 179
  },
  {
    "x": 7,
    "y": 134
  },
  {
    "x": 8,
    "y": 34
  },
  {
    "x": 9,
    "y": 292
  },
  {
    "x": 10,
    "y": 226
  },
  {
    "x": 11,
    "y": 52
  },
  {
    "x": 12,
    "y": 289
  }
];

/**
 * Data Access Object for the Trace API.
 */
export class TraceDAO {

  public static async getTrace(userName: string, traceId: string): Promise<ITraceData> {
    return mockData;
  }
}
