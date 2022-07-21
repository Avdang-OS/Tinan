const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const commands = require('./handlers/cmdHandler');
const events = require('./handlers/eventHandler');

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
module.exports = client;

client.on('ready', () => {
  commands(client);
  events(client);
  console.log('Start completed.');
})
client.login(process.env.DISCORD_TOKEN);
