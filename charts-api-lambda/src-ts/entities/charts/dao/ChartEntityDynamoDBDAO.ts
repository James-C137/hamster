import { AttributeValue, DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { ChartEntity } from '../models/ChartEntity';
import { chartTypeSchema } from '../models/ChartType';
import { ChartEntityDAO } from './ChartEntityDAO';

export class ChartEntityDynamoDBDAO implements ChartEntityDAO {
  private readonly tableName: string;
  private client: DynamoDBClient | undefined;

  public constructor(tableName: string) {
    this.tableName = tableName
    this.connect()
  }

  public connect(): void {
    if (this.client) {
      return;
    }

    const region = process.env.REGION
    if (!region) {
      throw new Error('process.env.REGION not found.')
    }

    this.client =  new DynamoDBClient({
      region: region
    });
  }

  public disconnect(): void {
    this.client?.destroy();
    this.client = undefined;
  }

  public async getCharts(ownerId: string): Promise<ChartEntity[]> {
    if (!this.client) {
      return [];
    }

    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'ownerID = :ownerID',
      ExpressionAttributeValues: { ':ownerID': { S: ownerId }}
    })

    const output = await this.client.send(command)
    const chartEntities: ChartEntity[] = []
    output.Items?.forEach(item => {
      const chartType = chartTypeSchema.safeParse(item?.chartId?.S)
      chartEntities.push({
        ownerId: ownerId,
        chartId: item?.chartId?.S ?? '',
        type: chartType.success ? chartType.data : 'UNKNOWN',
        queryType: item?.query?.S ?? '',
        eventName: item?.eventName?.S ?? ''
      })
    })

    return chartEntities
  }

  public async postChart(chartEntity: ChartEntity): Promise<void> {
    if (!this.client) {
      return;
    }

    const item: Record<string, AttributeValue> = {}
    item.ownerID = { S: chartEntity.ownerId }
    if (chartEntity.chartId) { item.chartID = { S: chartEntity.chartId } }
    if (chartEntity.type) { item.type = { S: chartEntity.type } }
    if (chartEntity.queryType) { item.query = { S: chartEntity.queryType } }

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: item
    })

    await this.client.send(command)
  }

  public async deleteChart(ownerId: string, chartId: string): Promise<void> {
    if (!this.client) {
      return;
    }
  }
}
