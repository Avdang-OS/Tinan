import { Client, ActivityType } from 'discord.js';
import { config as env } from 'dotenv';
import reactions from "../config/reactions.json";
import { MessageHandler, EXEC_SYMBOL } from './handlers/message';
import { substringOrRegex } from './utils/formatDetector';
env();

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

client.login(process.env.DISCORD_TOKEN);
client.on("ready", () => {
  console.log("Ready!");

  // Register all the callbacks and stuff.
  let messagesToReact = Object.entries(reactions)
    .map(([key, value]) => [substringOrRegex(key), value] as [string | RegExp, string])
    .map(([pattern, reactions]) =>
      new MessageHandler(pattern)
        .react(reactions)
    );

  client.on("messageCreate", msg => {
    let test = new MessageHandler(/apples/gi)
      .author()
        .is("205658714311622656", "725985503177867295")
      .reply("Senpai has returned!");
    [
      ...messagesToReact,
      test
    ].forEach(handler => handler[EXEC_SYMBOL](msg));
  });
});
// unhandled rejection... just like how your girlfriend's rejection was like
// wow you're a chad! congratulations :party: :woo: :lessgo: I CANT EVEN EDIT MESSAGE.ts
// it doesnt change upon u doing something + u cant see my edits\
// can u make a new message.ts :weary: see if it fixes the issue
// copy paste ur message.ts