const { Client, Intents } = require('discord.js');
require('dotenv').config()
const commands = require('./handlers/commands');

const client = new Client({
	intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ]
});
module.exports = client;

client.on('ready', () => {
  commands(client);

  client.user.setPresence({ activities: [{ name: 'everyone!', type: 'LISTENING' }] });
	console.log('Start completed.');
});
client.login(process.env.DISCORD_TOKEN);