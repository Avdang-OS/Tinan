import { Client, GatewayIntentBits, ActivityType } from 'discord.js';
import { config } from 'dotenv';
config();
// import commands from './handlers/cmdHandler';
import events from './handlers/eventHandler.js';

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
