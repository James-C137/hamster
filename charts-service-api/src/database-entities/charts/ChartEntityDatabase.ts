import { AttributeValue, DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import ProcessEnvUtils from '../../../../lambda-utils/src-ts/ProcessEnvUtils';
import { ChartEntity } from './ChartEntity';
import { chartTypeSchema } from './ChartType';

export class ChartEntityDatabase {
  private readonly tableName: string;
  private client: DynamoDBClient | undefined;

  public constructor() {
    this.tableName = ProcessEnvUtils.getVar('CHARTS_TABLE_NAME');
    this.connect()
  }

  public connect(): void {
    if (this.client) return;
    this.client = new DynamoDBClient({region: ProcessEnvUtils.getVar('CHARTS_TABLE_REGION')});
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
    console.log('command');
    console.log(command);

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
