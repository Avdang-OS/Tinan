import { EmbedBuilder, Colors } from 'discord.js';
import { Octokit } from 'octokit';
import { config } from 'dotenv';
import type { Tinan } from '../global';
config();

export default {
  name: 'repolist',
  description: 'This is a test command that lists repositories in the Avdan-OS organisation.',
  callback: async interaction => {
    const octokit = new Octokit({ auth: process.env.GITHUB_API_KEY });
    let data = await octokit.request('GET /orgs/{org}/repos', { org: 'Avdan-OS' });
      
    let embed = new EmbedBuilder()
      .setTitle('Repository list')
      .setColor(Colors.Blue)
      .setFooter({ text: 'Click on an arrow to open the corresponding repository' });

    data.data.forEach(({ name, description }) => {
      embed.addFields([
        {
          name: `[${name}](https://github.com/Avdan-OS/${name})`,
          value: `${description ?? 'N/A'}`,
          inline: true
        }
      ]);
    });

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
} as Tinan.Command;
