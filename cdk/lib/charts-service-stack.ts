import { Stack, type Environment, type StackProps } from 'aws-cdk-lib'
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import { type Construct } from 'constructs'

interface ChartsServiceStackProps extends StackProps {
  env: Environment
}

export class ChartsServiceStack extends Stack {

  private readonly props: ChartsServiceStackProps
  public readonly chartsTable: Table
  public readonly chartsAPILambda: NodejsFunction
  public readonly apiGatway: RestApi

  constructor (scope: Construct, id: string, props: ChartsServiceStackProps) {
    super(scope, id, props)
    this.props = props

    this.chartsTable = this.createChartsTable()
    this.chartsAPILambda = this.createChartsAPILambda(this.chartsTable)
    this.apiGatway = this.createAPIGateway(this.chartsAPILambda)
  }

  private createChartsTable (): Table {
    const table = new Table(this, 'hamster-charts-table', {
      partitionKey: {
        type: AttributeType.STRING,
        name: 'ownerID'
      },
      sortKey: {
        type: AttributeType.STRING,
        name: 'chartID'
      },
      billingMode: BillingMode.PAY_PER_REQUEST
    })

    return table;
  }

  private createChartsAPILambda (chartsTable: Table): NodejsFunction {
    const lambda = new NodejsFunction(this, 'hamster-charts-api-lambda', {
      functionName: 'HamsterChartsAPILambda',
      runtime: Runtime.NODEJS_18_X,
      entry: '../charts-api-lambda/src-ts/handlers/handler.ts',
      environment: {
        'CHARTS_TABLE_NAME': chartsTable.tableName
      }
    })

    chartsTable.grantReadWriteData(lambda)

    return lambda
  }

  private createAPIGateway (handler: NodejsFunction): RestApi {
    const apiGateway = new RestApi(this, 'hamster-charts-api-gateway', {
      restApiName: 'HamsterChartsAPI',
      defaultIntegration: new LambdaIntegration(handler)
    })

    // Create all sub-resources
    const rootResource = apiGateway.root;

    // /charts
    const chartsResource = rootResource.addResource('charts')
    chartsResource.addMethod('GET')
    chartsResource.addMethod('POST')

    // /charts/{chartId}
    const chartIdResource = chartsResource.addResource('{chartId}')
    chartIdResource.addMethod('DELETE')

    // Export base URL into Systems Manager Parameter Store
    new StringParameter(this, 'hamster-charts-api-gateway-url', {
      parameterName: 'HamsterChartsBaseURL',
      stringValue: apiGateway.url
    })

    return apiGateway
  }
}
