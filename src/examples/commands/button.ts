import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } from 'discord.js';
import type { ButtonInteraction } from 'discord.js';
import type { Tinan } from '../../global';

/**
 * @file This is an example of a command that includes creating and responding to buttons.
 * @author AvdanOS
 */

export default {
  name: 'button',
  description: 'this is an example for buttons',
  callback: interaction => {
    let embed = new EmbedBuilder()
      .setTitle('example')
      .setDescription('this is an example for buttons')
      .setColor(Colors.Blue);

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('primary')
        .setLabel('example of a primary button')
        .setStyle(ButtonStyle.Primary),
        
      new ButtonBuilder()
        .setCustomId('secondary')
        .setLabel('example of a secondary button')
        .setStyle(ButtonStyle.Secondary),
    );

    interaction.reply({ embeds: [embed], components: [buttons as any], ephemeral: true });

    const filter = (buttonInteraction: ButtonInteraction) => {
      return interaction.user.id != buttonInteraction.user.id || interaction.user.id == buttonInteraction.user.id;
    }
    const collector = interaction.channel?.createMessageComponentCollector({ filter: filter as any, max: 1, time: 30000 });

    collector?.on('end', (collection: any) => {
      if (collection.first().customId == 'primary') {
        embed.setTitle('you clicked a primary button')
        embed.setDescription('you clicked a primary button')

        interaction.channel?.send({ embeds: [embed] });
      } else {
        embed.setTitle('you clicked a secondary button')
        embed.setDescription('you clicked a secondary button')

        interaction.channel?.send({ embeds: [embed] });
      }
    })
  }
} as Tinan.Command;
