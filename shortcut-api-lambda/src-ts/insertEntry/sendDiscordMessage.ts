import { Client, Events, GatewayIntentBits, type TextChannel } from 'discord.js'
import dotenv from 'dotenv'
import { type InsertEntryBody } from './index'
dotenv.config()

const USERNAME_TO_CHANNEL_ID = new Map<string, string>([
  ['james_c137', '1137838559781453865'],
  ['shatayu', '1137838577393340539']
])

export async function sendDiscordMessage (entryBody: InsertEntryBody): Promise<void> {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
  })

  client.once(Events.ClientReady, async (client) => {
    const channelID = USERNAME_TO_CHANNEL_ID.get(entryBody.username)
    if (channelID != null) {
      const channel = client.channels.cache.get(channelID) as TextChannel
      if (channel != null) {
        await channel.send(
            `username: ${entryBody.username}, ` +
            `analysisName: ${entryBody.analysisName ?? ''}, ` +
            `eventName: ${entryBody.eventName ?? ''}, ` +
            `data: ${entryBody.data ?? ''}`
        )
      }
    }
  })

  await client.login(process.env.DISCORD_CLIENT_TOKEN)
  await client.destroy()
}
