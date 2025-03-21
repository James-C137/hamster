import { Stack, type Environment, type StackProps } from 'aws-cdk-lib'
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import { type Construct } from 'constructs'

interface LogsServiceStackProps extends StackProps {
  env: Environment
}

export class LogsServiceStack extends Stack {
  private readonly props: LogsServiceStackProps
  public readonly logsAPILambda: NodejsFunction
  public readonly apiGateway: RestApi

  constructor (scope: Construct, id: string, props: LogsServiceStackProps) {
    super(scope, id, props)
    this.props = props

    this.logsAPILambda = this.createLogsAPILambda()
    this.apiGateway = this.createAPIGateway()
  }

  private createLogsAPILambda (): NodejsFunction {
    const lambda = new NodejsFunction(this, 'hamster-logs-api-lambda', {
      functionName: 'HamsterLogsAPILambda',
      runtime: Runtime.NODEJS_16_X,
      entry: '../logs-service-api/src/lambda-handlers/mainHandler.ts',
      handler: 'mainHandler',
      environment: {
        DATABASE_HOST: 'dpg-cjj7jnj37aks73borr30-a.oregon-postgres.render.com',
        DATABASE_PORT: '5432',
        DATABASE_NAME: 'hamster_entries',
        DATABASE_USER: 'hamster',
        DATABASE_PASSWORD: 'FpfSfWQf0ujZKM28SIEDKKZbcSJKqVW0'
      }
    })

    return lambda
  }

  private createAPIGateway (): RestApi {
    const apiGateway = new RestApi(this, 'hamster-logs-api-gateway', {
      restApiName: 'HamsterLogsAPI',
      defaultIntegration: new LambdaIntegration(this.logsAPILambda)
    })

    // Create all sub-resources
    const logsResource = apiGateway.root.addResource('logs')
    logsResource.addMethod('GET')
    logsResource.addMethod('POST')

    // Export base URL into Systems Manager Parameter Store
    new StringParameter(this, 'hamster-logs-api-gateway-url', {
      parameterName: 'HamsterLogsBaseURL',
      stringValue: apiGateway.url
    })

    return apiGateway
  }
}
