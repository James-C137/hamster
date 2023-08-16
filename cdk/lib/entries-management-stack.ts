import { Environment, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

interface EntryManagementStackProps extends StackProps {
  env: Environment;
}

export class EntryManagementStack extends Stack {

  private readonly props: EntryManagementStackProps;
  public readonly entriesTable: Table;
  public readonly entriesAPILambda: NodejsFunction;
  public readonly apiGatway: RestApi;

  constructor(scope: Construct, id: string, props: EntryManagementStackProps) {
    super(scope, id, props);
    this.props = props;
   
    this.entriesTable = this.createEntriesTable();
    this.entriesAPILambda = this.createEntriesAPILambda(this.entriesTable);
    this.apiGatway = this.createAPIGateway(this.entriesAPILambda);
  }

  private createEntriesTable(): Table {
    const table = new Table(this, 'hamster-entries-table', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'username',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: AttributeType.STRING,
      },
    });

    return table;
  }

  private createEntriesAPILambda(entriesTable: Table) {
    const lambda = new NodejsFunction(this, 'hamster-entries-api-lambda', {
      functionName: 'HamsterEntriesAPILambda',
      runtime: Runtime.NODEJS_16_X,
      entry: '../entries-api-lambda/src-ts/handler.ts',
      environment: {
        ENTRIES_TABLE_NAME: entriesTable.tableName,
      },
    });

    entriesTable.grantReadWriteData(lambda);

    return lambda;
  }

  private createAPIGateway(entriesAPILambda: NodejsFunction): RestApi {
    const apiGateway = new RestApi(this, 'hamster-entries-api-gateway', {
      restApiName: 'HamsterEntriesAPI',
    });

    // Create all sub-resources
    this.createPingResource(apiGateway, entriesAPILambda);
    this.createUsersResource(apiGateway);
    this.createEntriesResource(apiGateway, entriesAPILambda);

    // Export base URL into Systems Manager Parameter Store
    new StringParameter(this, 'hamster-entries-api-gateway-url', {
      parameterName: 'HamsterEntriesBaseURL',
      stringValue: apiGateway.url,
    });

    return apiGateway;
  }

  private createPingResource(apiGateway: RestApi, entriesAPILambda: NodejsFunction): void {
    const ping = apiGateway.root.addResource('ping');
    ping.addMethod('GET', new LambdaIntegration(entriesAPILambda))
  }

  private createUsersResource(apiGateway: RestApi): void {
    const users = apiGateway.root.addResource('users');
    users.addResource('{userID}');
  }

  private createEntriesResource(apiGateway: RestApi, entriesAPILambda: NodejsFunction): void {
    const users = apiGateway.root.getResource('users');
    const userID = users?.getResource('{userID}');
    const entries = userID?.addResource('entries');
    entries?.addMethod('POST', new LambdaIntegration(entriesAPILambda));
  };
}
