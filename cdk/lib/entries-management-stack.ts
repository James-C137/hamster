import { Stack, type Environment, type StackProps } from 'aws-cdk-lib'
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import { type Construct } from 'constructs'

interface EntryManagementStackProps extends StackProps {
  env: Environment
}

export class EntryManagementStack extends Stack {
  private readonly props: EntryManagementStackProps
  public readonly entriesAPILambda: NodejsFunction
  public readonly apiGatway: RestApi

  constructor (scope: Construct, id: string, props: EntryManagementStackProps) {
    super(scope, id, props)
    this.props = props

    this.entriesAPILambda = this.createEntriesAPILambda()
    this.apiGatway = this.createAPIGateway()
  }

  private createEntriesAPILambda (): NodejsFunction {
    const lambda = new NodejsFunction(this, 'hamster-entries-api-lambda', {
      functionName: 'HamsterEntriesAPILambda',
      runtime: Runtime.NODEJS_16_X,
      entry: '../entries-api-lambda/src-ts/handler.ts',
      environment: {
        HOST: 'dpg-cjj7jnj37aks73borr30-a.oregon-postgres.render.com',
        PORT: '5432',
        DATABASE_NAME: 'hamster_entries',
        USER: 'hamster',
        PASSWORD: 'FpfSfWQf0ujZKM28SIEDKKZbcSJKqVW0'
      }
    })

    return lambda
  }

  private createAPIGateway (): RestApi {
    const apiGateway = new RestApi(this, 'hamster-entries-api-gateway', {
      restApiName: 'HamsterEntriesAPI',
      defaultIntegration: new LambdaIntegration(this.entriesAPILambda)
    })

    // Create all sub-resources
    this.createLogsResource(apiGateway)
    this.createPingResource(apiGateway)
    this.createUsersResource(apiGateway)
    this.createEntriesResource(apiGateway)
    this.createSqlResource(apiGateway)

    // Export base URL into Systems Manager Parameter Store
    new StringParameter(this, 'hamster-entries-api-gateway-url', {
      parameterName: 'HamsterEntriesBaseURL',
      stringValue: apiGateway.url
    })

    return apiGateway
  }

  private createLogsResource (apiGateway: RestApi): void {
    const logsResource = apiGateway.root.addResource('logs')
    logsResource.addMethod('GET')
  }

  private createPingResource (apiGateway: RestApi): void {
    const ping = apiGateway.root.addResource('ping')
    ping.addMethod('GET')
  }

  private createUsersResource (apiGateway: RestApi): void {
    const users = apiGateway.root.addResource('users')
    users.addResource('{userID}')
  }

  private createEntriesResource (apiGateway: RestApi): void {
    const users = apiGateway.root.getResource('users')
    const userID = users?.getResource('{userID}')
    const entries = userID?.addResource('entries')
    entries?.addMethod('POST')
  }

  private createSqlResource (apiGateway: RestApi): void {
    const users = apiGateway.root.getResource('users')
    const userID = users?.getResource('{userID}')
    const sql = userID?.addResource('sql')
    sql?.addMethod('POST')
  }
}
