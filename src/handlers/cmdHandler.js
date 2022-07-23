require('dotenv').config();
const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
  global.pollsList = {};
  const commands = [];
  const commandPath = './commands';

  for (const guildID of client.guilds.cache.keys()) {
    const guild = client.guilds.cache.get(guildID);
    await guild.commands.set(commands);
  }
  
  fs.readdirSync(path.join(process.cwd(), commandPath)).filter(file => file.endsWith('.js')).forEach(file => {
    let pull = require(path.join(process.cwd(), commandPath, file));
    commands.push(pull);
  });
  exports.commands = commands;
};
