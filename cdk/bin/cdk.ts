#!/usr/bin/env node
import { App, type Environment } from 'aws-cdk-lib'
import { ChartsServiceStack } from '../lib/charts-service-stack'
import { LogsServiceStack } from '../lib/logs-management-stack'
import { ShortcutFrontendStack } from '../lib/shortcut-frontend-stack'

const defaultEnv: Environment = {
  account: process.env.ACCOUNT,
  region: process.env.REGION
}

const app = new App()

new LogsServiceStack(app, 'HamsterLogsServiceStack', {
  env: defaultEnv
})

new ChartsServiceStack(app, 'HamsterChartsServiceStack', {
  env: defaultEnv
})

new ShortcutFrontendStack(app, 'HamsterShorcutFrontendStack', {
  env: defaultEnv
})
