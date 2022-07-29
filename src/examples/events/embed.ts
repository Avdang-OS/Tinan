import { EmbedBuilder, Colors } from 'discord.js';
import type { Tinan } from '../../global';

/**
 * @file This is an example of an event that will respond with an embed if you say 'embed example'.
 * @author AvdanOS
 */

export default {
  name: ['embed example'],
  callback: message => {
    const embed = new EmbedBuilder()
      .setTitle('Embed example')
      .setColor(Colors.Blue)
    
    message.channel.send({ embeds: [embed] });
  }
} as Tinan.OtherEvent;
