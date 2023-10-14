import { IChartFactoryData } from "../components/chart/ChartFactory";

const mockData = [
  {
    "id": "japan",
    "color": "hsl(277, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 23
      },
      {
        "x": "helicopter",
        "y": 74
      },
      {
        "x": "boat",
        "y": 152
      },
      {
        "x": "train",
        "y": 236
      },
      {
        "x": "subway",
        "y": 89
      },
      {
        "x": "bus",
        "y": 179
      },
      {
        "x": "car",
        "y": 134
      },
      {
        "x": "moto",
        "y": 34
      },
      {
        "x": "bicycle",
        "y": 292
      },
      {
        "x": "horse",
        "y": 226
      },
      {
        "x": "skateboard",
        "y": 52
      },
      {
        "x": "others",
        "y": 289
      }
    ]
  },
  {
    "id": "france",
    "color": "hsl(133, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 240
      },
      {
        "x": "helicopter",
        "y": 185
      },
      {
        "x": "boat",
        "y": 121
      },
      {
        "x": "train",
        "y": 82
      },
      {
        "x": "subway",
        "y": 70
      },
      {
        "x": "bus",
        "y": 32
      },
      {
        "x": "car",
        "y": 232
      },
      {
        "x": "moto",
        "y": 80
      },
      {
        "x": "bicycle",
        "y": 228
      },
      {
        "x": "horse",
        "y": 293
      },
      {
        "x": "skateboard",
        "y": 50
      },
      {
        "x": "others",
        "y": 96
      }
    ]
  },
  {
    "id": "us",
    "color": "hsl(161, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 146
      },
      {
        "x": "helicopter",
        "y": 220
      },
      {
        "x": "boat",
        "y": 255
      },
      {
        "x": "train",
        "y": 159
      },
      {
        "x": "subway",
        "y": 186
      },
      {
        "x": "bus",
        "y": 58
      },
      {
        "x": "car",
        "y": 57
      },
      {
        "x": "moto",
        "y": 66
      },
      {
        "x": "bicycle",
        "y": 23
      },
      {
        "x": "horse",
        "y": 272
      },
      {
        "x": "skateboard",
        "y": 130
      },
      {
        "x": "others",
        "y": 18
      }
    ]
  },
  {
    "id": "germany",
    "color": "hsl(187, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 17
      },
      {
        "x": "helicopter",
        "y": 87
      },
      {
        "x": "boat",
        "y": 21
      },
      {
        "x": "train",
        "y": 21
      },
      {
        "x": "subway",
        "y": 109
      },
      {
        "x": "bus",
        "y": 120
      },
      {
        "x": "car",
        "y": 184
      },
      {
        "x": "moto",
        "y": 263
      },
      {
        "x": "bicycle",
        "y": 57
      },
      {
        "x": "horse",
        "y": 22
      },
      {
        "x": "skateboard",
        "y": 148
      },
      {
        "x": "others",
        "y": 94
      }
    ]
  },
  {
    "id": "norway",
    "color": "hsl(260, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 242
      },
      {
        "x": "helicopter",
        "y": 281
      },
      {
        "x": "boat",
        "y": 93
      },
      {
        "x": "train",
        "y": 162
      },
      {
        "x": "subway",
        "y": 8
      },
      {
        "x": "bus",
        "y": 32
      },
      {
        "x": "car",
        "y": 261
      },
      {
        "x": "moto",
        "y": 189
      },
      {
        "x": "bicycle",
        "y": 246
      },
      {
        "x": "horse",
        "y": 252
      },
      {
        "x": "skateboard",
        "y": 46
      },
      {
        "x": "others",
        "y": 60
      }
    ]
  }
];

/**
 * Data Access Object for the Trace API.
 */
export class TraceDAO {

  public static async getTrace(userName: string, traceId: string): Promise<IChartFactoryData> {
    return {
      chartType: 'line',
      chartData: mockData
    }
  }
}
