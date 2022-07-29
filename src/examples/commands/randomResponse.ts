import { EmbedBuilder, Colors } from 'discord.js';
import type { Tinan } from '../../global';

/**
 * @file This is an example of random responses.
 * @author AvdanOS
 */

export default {
  name: 'randomresponse',
  description: 'this is a random response example',
  callback: interaction => {
    const messages = [
      'example',
      'wow, this is another message?',
      'hello world'
    ];
    
    const title = messages[Math.floor(Math.random() * messages.length)];
    const embed = new EmbedBuilder()
      .setTitle(`${title}`)
      .setColor(Colors.Blue)

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
} as Tinan.Command;
