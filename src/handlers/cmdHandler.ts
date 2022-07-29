import {} from 'dotenv/config';
import fs from 'fs';
import path from 'path';
import type { Client } from 'discord.js';

const COMMAND_PATH = './commands';
export default async (client: Client) => {
  global.pollsList = {};
  const commands = getCommands();

  // Attach all the commands to every server 
  for (const guildID of client.guilds.cache.keys()) {
    const guild = client.guilds.cache.get(guildID);
    await guild?.commands.set(commands);
  }
};

export function getCommands() {
  return fs.readdirSync(path.join(process.cwd(), COMMAND_PATH))
    .filter(file => file.endsWith('.ts'))
    .map(file => require(path.join(process.cwd(), COMMAND_PATH, file)));
}
