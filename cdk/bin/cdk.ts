#!/usr/bin/env node
import { App, type Environment } from 'aws-cdk-lib'
import { EntryManagementStack } from '../lib/entries-management-stack'
import { ShortcutFrontendStack } from '../lib/shortcut-frontend-stack'

const defaultEnv: Environment = {
  account: process.env.ACCOUNT,
  region: process.env.REGION
}

const app = new App()

new EntryManagementStack(app, 'HamsterEntryManagementStack', {
  env: defaultEnv
})

new ShortcutFrontendStack(app, 'HamsterShorcutFrontendStack', {
  env: defaultEnv
})
