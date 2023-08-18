import { type Environment, Stack, type StackProps } from 'aws-cdk-lib'
import { Vpc } from 'aws-cdk-lib/aws-ec2'
import { Repository } from 'aws-cdk-lib/aws-ecr'
import { Cluster, Compatibility, ContainerImage, CpuArchitecture, FargateService, LogDrivers, OperatingSystemFamily, TaskDefinition } from 'aws-cdk-lib/aws-ecs'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { RetentionDays } from 'aws-cdk-lib/aws-logs'
import { type Construct } from 'constructs'

interface DiscordFrontendStackProps extends StackProps {
  env: Environment
}

export class DiscordFrontendStack extends Stack {
  private readonly props: DiscordFrontendStackProps
  public readonly discordVPC: Vpc
  public readonly discordCluster: Cluster
  public readonly discordTaskDefinition: TaskDefinition
  public readonly discordService: FargateService

  constructor (scope: Construct, id: string, props: DiscordFrontendStackProps) {
    super(scope, id, props)
    this.props = props

    this.discordVPC = this.createDiscordVPC()
    this.discordCluster = this.createDiscordCluster(this.discordVPC)
    this.discordTaskDefinition = this.createDiscordTaskDefinition()
    this.discordService = this.createDiscordService(this.discordCluster, this.discordTaskDefinition)
  }

  public createDiscordVPC (): Vpc {
    const vpc = new Vpc(this, 'hamster-discord-vpc')
    return vpc
  }

  public createDiscordCluster (vpc: Vpc): Cluster {
    const cluster = new Cluster(this, 'hamster-discord-cluster', {
      vpc
    })
    return cluster
  }

  public createDiscordTaskDefinition (): TaskDefinition {
    const taskDefinition = new TaskDefinition(this, 'hamster-discord-task-definition', {
      compatibility: Compatibility.FARGATE,
      cpu: '256',
      memoryMiB: '512',
      runtimePlatform: {
        cpuArchitecture: CpuArchitecture.X86_64,
        operatingSystemFamily: OperatingSystemFamily.LINUX
      }
    })

    taskDefinition.addToTaskRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'ssm:GetParameter'
      ],
      resources: [
        '*'
      ]
    }))

    const repo = Repository.fromRepositoryArn(
      this,
      'hamster-discord-repository',
      'arn:aws:ecr:us-east-1:740983408400:repository/hamster-discord-repository'
    )

    taskDefinition.addContainer('hamster-discord-container', {
      image: ContainerImage.fromEcrRepository(repo),
      logging: LogDrivers.awsLogs({
        streamPrefix: 'ecs',
        logRetention: RetentionDays.FIVE_DAYS
      }),
      environment: {
        REGION: this.props.env.region ?? ''
      }
    })

    return taskDefinition
  }

  public createDiscordService (cluster: Cluster, taskDefinition: TaskDefinition): FargateService {
    const service = new FargateService(this, 'hamster-discord-service', {
      cluster,
      taskDefinition,
      desiredCount: 1
    })

    return service
  }
}
