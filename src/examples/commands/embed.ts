import { EmbedBuilder, Colors } from 'discord.js';
import type { Tinan } from '../../global';

/**
 * @file This is an example of an embed.
 * @author AvdanOS
 */

export default {
  name: 'embed',
  description: 'this is an embed example',
  callback: interaction => {
    const embed = new EmbedBuilder()
      .setTitle('example')
      .setDescription('this is an example of an embed')
      .addFields([
        { name: 'field example 1', value: 'field example 1' },
        { name: 'field example 2', value: 'field example 2' },
      ])
      .setFooter({ text: 'footer example' })
      .setColor(Colors.Blue)
    
    interaction.reply({ embeds: [embed], ephemeral: true });
  }  
} as Tinan.Command;
