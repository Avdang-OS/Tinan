const { Client, Intents } = require('discord.js');
require('dotenv').config();
const commands = require('./handlers/cmdHandler');

const client = new Client({
	intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ]
});

commands(client);
client.login(process.env.DISCORD_TOKEN);
