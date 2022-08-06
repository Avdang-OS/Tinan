import { Client, GatewayIntentBits, ActivityType } from 'discord.js';
import { config } from 'dotenv';
// import commands from './handlers/cmdHandler';
import events from './handlers/eventHandler.js';
config();

const client = new Client({
  presence: {
    activities: [{
      name: 'discord.gg/avdanos',
      type: ActivityType.Watching,
    }],
  },
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.on('ready', () => {
  // commands(client);
  events(client);
  console.log('Start completed.');
});

client.login(process.env.TOKEN);
