import dotenv from 'dotenv'
import { Client, Events, GatewayIntentBits, type Message } from 'discord.js'
import axios from 'axios'
dotenv.config()

const client = new Client({
  intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
})

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`)
})

client.on('messageCreate', async (message: Message) => {
  if (
    message.content.length > 2 &&
    message.content.substring(0, 2) === 'h ' &&
    !message.author.bot
  ) {
    const parsedMessage = parseMessage(
      message.author.username, message.content.substring(2)
    )
    await axios.post(`https://8zds423cx7.execute-api.us-east-1.amazonaws.com/prod/users/${parsedMessage.username}/entries`, parsedMessage)
    await message.reply(`username: ${parsedMessage.username}, ` +
    `analysisName: ${parsedMessage.analysisName}, ` +
    `eventName: ${parsedMessage.eventName}, ` +
    `data: ${parsedMessage.data}`)
  }
})

// login bot
await client.login(process.env.CLIENT_TOKEN)

function parseMessage (username: string, text: string): ParsedMessageType {
  const words = text.split(' ')

  // fill in analysis name and event name
  let analysisName = null
  let eventName = null

  if (words.length > 1 && words[0][0] === '@' && words[1][0] === '#') {
    const temp = words[0]
    words[0] = words[1]
    words[1] = temp
  }

  // fill analysis name
  if (words[0][0] === '#') {
    analysisName = words[0].replace('#', '')
    words.splice(0, 1)
  }

  // fill event name
  if (words.length > 0 && words[0][0] === '@') {
    eventName = words[0].replace('@', '')
    words.splice(0, 1)
  }

  const data = words.join(' ')

  return {
    timestamp: Date.now(),
    username,
    analysisName: analysisName ?? '',
    eventName: eventName ?? '',
    data: data ?? ''
  }
}

interface ParsedMessageType {
  timestamp: number
  username: string
  analysisName: string
  eventName: string
  data: string
}
