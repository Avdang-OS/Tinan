import { EmbedBuilder, InteractionType, Colors } from 'discord.js';
import { getCommands } from '../../handlers/cmdHandler';
import type { Client, Interaction } from 'discord.js';
import type { Tinan } from '../../global';

export default {
  callback: async (client: Client) => {
    client.on('interactionCreate', async (interaction: Interaction) => {
      if (interaction.type === InteractionType.ApplicationCommand) {
        const commands = getCommands();

        let responses = commands
          .filter(cmd => cmd.name === interaction.commandName)
          .map(cmd => cmd.callback(interaction).catch(() => {
              const embed = new EmbedBuilder()
                .setTitle('An error occured while executing that command.')
                .setColor(Colors.Red);

              interaction.reply({ embeds: [embed], ephemeral: true });
            })
          );
        
        await Promise.all(responses);
        console.log(commands);
      }
    })
  }
} as Tinan.DiscordEvent;
