import { Aspects, Environment, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { InstanceType, Peer, Port, SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { AuroraPostgresEngineVersion, CfnDBCluster, DatabaseCluster, DatabaseClusterEngine, ServerlessCluster } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

interface EntryStackProps extends StackProps {
  env: Environment;
}

export class EntryStack extends Stack {

  private readonly props: EntryStackProps;
  public readonly databaseVPC: Vpc;
  public readonly databaseSecurityGroup: SecurityGroup;
  public readonly databaseCluster: DatabaseCluster;
  public readonly entriesTable: Table;
  public readonly entriesAPILambda: NodejsFunction;

  constructor(scope: Construct, id: string, props: EntryStackProps) {
    super(scope, id, props);
    this.props = props;
   
    this.entriesTable = this.createEntriesTable();
    this.entriesAPILambda = this.createEntriesAPILambda(this.entriesTable);
  }

  private createEntriesTable(): Table {
    const table = new Table(this, 'hamster-entries-table', {
      tableName: 'HamsterEntriesTable',
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

  private createDatabaseVPC() {
    const vpc = new Vpc(this, 'hamster-database-vpc', {
      cidr: '10.0.0.0/16',
      subnetConfiguration: [{ name: 'egress', subnetType: SubnetType.PUBLIC }],
      natGateways: 0,
    });

    return vpc;
  }

  private createDatabaseSecurityGroup(databaseVPC: Vpc) {
    const securityGroup = new SecurityGroup(this, 'hamster-database-sg', {
      vpc: databaseVPC,
      allowAllOutbound: true,
    });

    securityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(5432),
    );

    return securityGroup;
  }

  private createEntriesDatabaseCluster(databaseVPC: Vpc, databaseSecurityGroup: SecurityGroup) {
    const cluster = new ServerlessCluster(this, 'hamster-database-cluster', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_13_9,
      }),
    })
    const databaseCluster = new DatabaseCluster(this, 'hamster-database-cluster', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_13_9,
      }),
      instances: 1,
      instanceProps: {
        vpc: databaseVPC,
        instanceType: new InstanceType('serverless'),
        autoMinorVersionUpgrade: true,
        publiclyAccessible: true,
        securityGroups: [databaseSecurityGroup],
        vpcSubnets: databaseVPC.selectSubnets({
          subnetType: SubnetType.PUBLIC,
        }),
      },
      port: 5432,
    });

    Aspects.of(databaseCluster).add({
      visit(node) {
        if (node instanceof CfnDBCluster) {
          node.serverlessV2ScalingConfiguration = {
            minCapacity: 0.5, // min capacity is 0.5 vCPU
            maxCapacity: 1, // max capacity is 1 vCPU (default)
          }
        }
      },
    })

    return databaseCluster;
  }

  private createEntriesAPILambda(entriesTable: Table) {
    const lambda = new NodejsFunction(this, 'hamster-api-lambda', {
      functionName: 'HamsterAPILambda',
      runtime: Runtime.NODEJS_16_X,
      entry: '../entries-api-lambda/src-ts/handler.ts',
      environment: {
        ENTRIES_TABLE_NAME: entriesTable.tableName,
      },
    });

    entriesTable.grantReadWriteData(lambda);

    return lambda;
  }
}
