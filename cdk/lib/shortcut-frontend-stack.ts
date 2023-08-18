import { Duration, Stack, type Environment, type StackProps } from 'aws-cdk-lib'
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import { type Construct } from 'constructs'

const dotenv = require('dotenv')
dotenv.config()

interface ShortcutFrontendStackProps extends StackProps {
  env: Environment
}

export class ShortcutFrontendStack extends Stack {
  private readonly props: ShortcutFrontendStackProps
  public readonly shortcutAPILambda: NodejsFunction
  public readonly apiGatway: RestApi

  constructor (scope: Construct, id: string, props: ShortcutFrontendStackProps) {
    super(scope, id, props)
    this.props = props

    this.shortcutAPILambda = this.createShortcutAPILambda()
    this.apiGatway = this.createAPIGateway(this.shortcutAPILambda)
  }

  private createShortcutAPILambda (): NodejsFunction {
    const lambda = new NodejsFunction(this, 'hamster-shortcut-api-lambda', {
      functionName: 'HamsterShortcutAPILambda',
      runtime: Runtime.NODEJS_16_X,
      entry: '../shortcut-api-lambda/src-ts/handler.ts',
      timeout: Duration.seconds(15),
      environment: {
        'DISCORD_CLIENT_TOKEN': process.env.DISCORD_CLIENT_TOKEN ?? ''
      }
    })

    lambda.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'ssm:GetParameter'
      ],
      resources: [
        '*'
      ]
    }))

    return lambda
  }

  private createAPIGateway (shortcutAPILambda: NodejsFunction): RestApi {
    const apiGateway = new RestApi(this, 'hamster-shortcut-api-gateway', {
      restApiName: 'HamsterShortcutAPI'
    })

    // Create all sub-resources
    this.createUsersResource(apiGateway)
    this.createEntriesResource(apiGateway, shortcutAPILambda)

    // Export base URL into Systems Manager Parameter Store
    new StringParameter(this, 'hamster-shortcut-api-gateway-url', {
      parameterName: 'HamsterShortcutBaseURL',
      stringValue: apiGateway.url
    })

    return apiGateway
  }

  private createUsersResource (apiGateway: RestApi): void {
    const users = apiGateway.root.addResource('users')
    users.addResource('{userID}')
  }

  private createEntriesResource (apiGateway: RestApi, shortcutAPILambda: NodejsFunction): void {
    const users = apiGateway.root.getResource('users')
    const userID = users?.getResource('{userID}')
    const entries = userID?.addResource('entries')
    entries?.addMethod('POST', new LambdaIntegration(shortcutAPILambda))
  };
}
