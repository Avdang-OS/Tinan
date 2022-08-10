import { EmbedBuilder, SlashCommandBuilder, Colors } from "discord.js";
import { Octokit } from "octokit";
import { config } from "dotenv";
import type { Tinan } from "@/types";
config();

export default {
  options:
    new SlashCommandBuilder()
      .setName("repolist")
      .setDescription("This is a test command that lists repositories in the Avdan-OS organisation."),

  async command(cmd) {
    const octokit = new Octokit({ auth: process.env.GITHUB_API_KEY });
    let data = await octokit.request('GET /orgs/{org}/repos', { org: 'Avdan-OS' });

    let embed = new EmbedBuilder()
      .setTitle("Repository list")
      .setColor(Colors.Blue)
      .setFooter({ text: "Click on an arrow to open the corresponding repository" });

    embed.addFields(
      data.data.map(({ name, description }) =>
        ({
          name: `${name}`,
          value: `[▓▓▓▓▓▓▓▓](https://github.com/Avdan-OS/${name} 'Link to repo.')\n${description ?? 'N/A'}`,
          inline: true
        })
      )
    );

    cmd
      .reply({ embeds: [embed] });
  }
} as Tinan.Command;
