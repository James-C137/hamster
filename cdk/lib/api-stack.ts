import { Environment, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

interface APIStackProps extends StackProps {
  env: Environment;
  entriesAPILambda: NodejsFunction;
}

export class APIStack extends Stack {

  private readonly props: APIStackProps;
  public readonly apiGatway: RestApi;

  constructor(scope: Construct, id: string, props: APIStackProps) {
    super(scope, id, props);
    this.props = props;

    this.apiGatway = this.createAPIGateway();
    this.createPingResource();
    this.createUsersResource();
    this.createEntriesResource();
  }

  private createAPIGateway(): RestApi {
    const apiGateway = new RestApi(this, 'hamster-api-gateway', {
      restApiName: 'HamsterAPI',
    });

    return apiGateway;
  }

  private createPingResource(): void {
    const ping = this.apiGatway.root.addResource('ping');
    ping.addMethod('GET', new LambdaIntegration(this.props.entriesAPILambda))
  }

  private createUsersResource(): void {
    const users = this.apiGatway.root.addResource('users');
    users.addResource('{userID}');
  }

  private createEntriesResource(): void {
    const users = this.apiGatway.root.getResource('users');
    const userID = users?.getResource('{userID}');
    const entries = userID?.addResource('entries');
    entries?.addMethod('POST', new LambdaIntegration(this.props.entriesAPILambda));
  };
}
