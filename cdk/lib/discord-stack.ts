import { Environment, Stack, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Cluster, Compatibility, ContainerImage, CpuArchitecture, FargateService, LogDrivers, OperatingSystemFamily, TaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

interface DiscordStackProps extends StackProps {
  env: Environment;
}

export class DiscordStack extends Stack {

  private readonly props: DiscordStackProps;
  public readonly discordVPC: Vpc;
  public readonly discordCluster: Cluster;
  public readonly discordTaskDefinition: TaskDefinition;
  public readonly discordService: FargateService;

  constructor(scope: Construct, id: string, props: DiscordStackProps) {
    super(scope, id, props);
    this.props = props;

    this.discordVPC = this.createDiscordVPC();
    this.discordCluster = this.createDiscordCluster(this.discordVPC);
    this.discordTaskDefinition = this.createDiscordTaskDefinition();
    this.discordService = this.createDiscordService(this.discordCluster, this.discordTaskDefinition);
  }

  public createDiscordVPC(): Vpc {
    const vpc = new Vpc(this, 'hamster-discord-vpc');
    return vpc;
  }

  public createDiscordCluster(vpc: Vpc): Cluster {
    const cluster = new Cluster(this, 'hamster-discord-cluster', {
      vpc: vpc,
    });
    return cluster;
  }

  public createDiscordTaskDefinition(): TaskDefinition {
    const taskDefinition = new TaskDefinition(this, 'hamster-discord-task-definition', {
      compatibility: Compatibility.FARGATE,
      cpu: '256',
      memoryMiB: '512',
      runtimePlatform: {
        cpuArchitecture: CpuArchitecture.X86_64,
        operatingSystemFamily: OperatingSystemFamily.LINUX,
      },
    });

    const repo = Repository.fromRepositoryArn(
      this,
      'hamster-discord-repository',
      'arn:aws:ecr:us-east-1:740983408400:repository/hamster-discord-repository'
    );

    taskDefinition.addContainer('hamster-discord-container', {
      image: ContainerImage.fromEcrRepository(repo),
      logging: LogDrivers.awsLogs({
        streamPrefix: 'ecs',
        logRetention: RetentionDays.FIVE_DAYS,
      })
    });

    return taskDefinition;
  }

  public createDiscordService(cluster: Cluster, taskDefinition: TaskDefinition): FargateService {
    const service = new FargateService(this, 'hamster-discord-service', {
      cluster: cluster,
      taskDefinition: taskDefinition,
      desiredCount: 1,
    });

    return service;
  }
}
