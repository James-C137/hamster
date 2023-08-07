#!/usr/bin/env node
import { App, Environment } from 'aws-cdk-lib';
import { APIStack } from '../lib/api-stack';
import { DiscordStack } from '../lib/discord-stack';
import { EntryStack } from '../lib/entry-stack';

const defaultEnv: Environment = {
  account: process.env.ACCOUNT,
  region: process.env.REGION,
}

const app = new App();

const discordStack = new DiscordStack(app, 'HamsterDiscordStack', {
  env: defaultEnv,
});

const entryStack = new EntryStack(app, 'HamsterEntryStack', {
  env: defaultEnv,
});

const apiStack = new APIStack(app, 'HamsterAPIStack', {
  env: defaultEnv,
  entriesAPILambda: entryStack.entriesAPILambda,
});
