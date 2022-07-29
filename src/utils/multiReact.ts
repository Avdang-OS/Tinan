import type { Message } from 'discord.js';

export const multiReact = async (msg: Message, emotes: string) => {
  for (const emote of emotes) {
    await msg.react(emote).catch(console.error); 
  }
}

