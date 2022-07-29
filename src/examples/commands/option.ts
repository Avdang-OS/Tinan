import { EmbedBuilder, ApplicationCommandOptionType, Colors } from 'discord.js';
import type { Tinan } from '../../global'; 

/**
 * @file This is an example of options.
 * @author AvdanOS
 */

export default {
  name: 'option',
  description: 'this is an option example',
  options: [
    {
      name: 'option',
      description: 'option',
      type: ApplicationCommandOptionType.String,
      required: true, // Or false
      choices: [
        {
          name: 'yes',
          value: 'yes'
        },
        {
          name: 'no',
          value: 'no'
        }
      ]
    }
  ],
  callback: interaction => {
    const option = (interaction.options as any).getString('option');
    let embed = new EmbedBuilder()
    
    if (option == 'yes') {
      embed.setTitle('you like option')
      embed.setColor(Colors.Green)
    } else {
      embed.setTitle('you hate option :<')
      embed.setColor(Colors.Red)
    }
    interaction.reply({ embeds: [embed], ephemeral: true });
  }  
} as Tinan.Command;
