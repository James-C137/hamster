import { Stack, type StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { type Construct } from 'constructs';

export class ShortcutGeneratorStack extends Stack {

  public readonly shortcutGeneratorLambda: NodejsFunction;
  public readonly shortcutGeneratorApi: RestApi;

  constructor (scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    this.shortcutGeneratorLambda = this.createShortcutGeneratorLambda();
    this.shortcutGeneratorApi = this.createShortcutGeneratorApi(this.shortcutGeneratorLambda);
  }

  private createShortcutGeneratorLambda(): NodejsFunction {
    const lambda = new NodejsFunction(this, 'create-shortcut-generator-lambda', {
      functionName: 'CreateShortcutGeneratorLambda',
      runtime: Runtime.NODEJS_16_X,
      entry: '../shortcut-generator-lambda/src-ts/handler.ts'
    });

    return lambda;
  }
  
  private createShortcutGeneratorApi(shortcutGeneratorLambda: NodejsFunction): RestApi {
    const api = new RestApi(this, 'create-shortcut-generator-api', {
      restApiName: 'HamsterShortcutAPI',
      defaultIntegration: new LambdaIntegration(shortcutGeneratorLambda)
    });

    const shortcutResource = api.root.addResource('shortcut');
    shortcutResource.addMethod('GET');
    
    return api;
  }
}
