import { Client, ActivityType, SlashCommandBuilder, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import { config as env } from 'dotenv';

import reactions from "../config/reactions.json";
import { MessageHandler, EXEC_SYMBOL } from './handlers/message';
import { substringOrRegex } from './utils/formatDetector';
import commands from './handlers/commands';


env();

// Weird commands

// Normal Bot stuff

let client = new Client({
  presence: {
    activities: [{
      name: 'discord.gg/avdanos',
      type: ActivityType.Watching,
    }],
  },
  intents: [
    "MessageContent",
    "Guilds",
    "GuildMessages",
  ],
});

const {interactionHandler} = commands();
client.login(process.env.DISCORD_TOKEN);


client.on("ready", bot => {
  console.log("Ready!");

  // Register all the callbacks and stuff.
  let messagesToReact = Object.entries(reactions)
    .map(([key, value]) => [substringOrRegex(key), value] as [string | RegExp, string])
    .map(([pattern, reactions]) =>
      new MessageHandler(pattern)
        .react(reactions)
    );

  bot.on("messageCreate", msg => {
    [
      ...messagesToReact
    ].forEach(handler => handler[EXEC_SYMBOL](msg));
  });


  
  bot.on("interactionCreate", interactionHandler);
});

