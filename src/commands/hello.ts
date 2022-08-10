import type { Tinan } from "@/types";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from "discord.js";

export default {
  options:
    new SlashCommandBuilder()
      .setName("hello")
      .setDescription("Test command to make me and Goos cry (goos cries out of seizure) :("),

  command(cmd) {

    const row : any = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("hello-000")
          .setLabel("First Guy")
          .setStyle(ButtonStyle.Primary)
      );

    cmd
      .reply({content : "Hello there!", components: [row]});
  },
  
  button(btn) {
    if (btn.customId.endsWith("000") ) {
      btn.reply("You clicked the first guy.");
      btn.message.delete();
    }
  }
} as Tinan.Command;
