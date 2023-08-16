#!/usr/bin/env node
import { App, Environment } from 'aws-cdk-lib';
import { DiscordFrontendStack } from '../lib/discord-frontent-stack';
import { EntryManagementStack } from '../lib/entries-management-stack';
import { ShortcutFrontendStack } from '../lib/shortcut-frontend-stack';

const defaultEnv: Environment = {
  account: process.env.ACCOUNT,
  region: process.env.REGION,
}

const app = new App();

const entryManagementStack = new EntryManagementStack(app, 'HamsterEntryManagementStack', {
  env: defaultEnv,
});

const discordFrontendStack = new DiscordFrontendStack(app, 'HamsterDiscordFrontendStack', {
  env: defaultEnv,
});

const shortcutFrontendStack = new ShortcutFrontendStack(app, 'HamsterShorcutFrontendStack', {
  env: defaultEnv,
});
