import fs from 'fs';
import path from 'path';
import type { Client, Message, Embed } from 'discord.js';
import type { Tinan } from '../../global';

export default {
  callback: async (client: Client) => {
    client.on('messageCreate', async (message: Message) => {
      const eventPath = './events';
    
      // Import the other custom callbacks
      const otherEvents = fs.readdirSync(path.join(process.cwd(), eventPath, '/other'))
        .filter(file => file.endsWith('.ts'))
        .map(file => require(
          path.join(process.cwd(), eventPath, '/other', file)
        ));
      
      // Check 
      let promEventResponses = otherEvents
        .map(async evt => { 
          evt.name.forEach((name: string | RegExp) => {
            if (name instanceof RegExp) {
              let res = name.exec(message.content);
              if(!(res?.groups)) return;
              return evt.callback(message, res.groups);
            }

            if (message.content.toLowerCase().includes(name)) {
              evt.callback.embeds?.forEach(
                (embed: Embed) => message.reply({ embeds: [embed] })
              );
            }
          });
          await evt.callback(message);
        })
        .map(prom => prom.catch(console.error));
      
      await Promise.all(promEventResponses);
    });
  }
} as Tinan.DiscordEvent;
