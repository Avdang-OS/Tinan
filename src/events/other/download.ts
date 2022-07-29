import { EmbedBuilder, Colors } from 'discord.js';
import type { Tinan } from '../../global';

export default {
  name: ['avdan os iso', 'download avdan os'],
  callback: message => {
    const embed = new EmbedBuilder()
      .setDescription('We have not finished developing AvdanOS, so there is not a download yet.\nWe are currently working on the **desktop environment**.\nSubscribe to [our Youtube channel](https://www.youtube.com/channel/UCHLCBj83J7bR82HwjhCJusA) for updates on our development.')
      .setColor(Colors.Blue)

    message.channel.send({ embeds: [embed] });
  }
} as Tinan.OtherEvent;
