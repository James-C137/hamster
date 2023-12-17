import { AttributeValue, DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import ProcessEnvUtils from '../../../../lambda-utils/src-ts/ProcessEnvUtils';
import { ChartEntity, chartEntitySchema } from './ChartEntity';

export class ChartEntityDatabase {
  private readonly tableName: string;
  private client: DynamoDBClient | undefined;

  public constructor() {
    this.tableName = ProcessEnvUtils.getVar('CHARTS_TABLE_NAME');
    this.connect()
  }

  public async connect(): Promise<void> {
    if (this.client) return;
    this.client = new DynamoDBClient({region: ProcessEnvUtils.getVar('CHARTS_TABLE_REGION')});;
  }

  public async disconnect(): Promise<void> {
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
      chartEntities.push(chartEntitySchema.parse({
        ownerId: ownerId,
        chartId: item?.chartID?.S,
        chartType: item?.chartType?.S,
        queryType: item?.queryType?.S,
        eventName: item?.eventName?.S
      }))
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
    if (chartEntity.chartType) { item.chartType = { S: chartEntity.chartType } }
    if (chartEntity.queryType) { item.queryType = { S: chartEntity.queryType } }
    if (chartEntity.eventName) { item.eventName = {S: chartEntity.eventName }}

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
