import type { Tinan } from "@/types";
import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonStyle, SlashCommandBuilder } from "discord.js";

export default {
  options: 
    new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Test command to make me cry :("),

    
  interaction(cmd) {

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("hello-000")
          .setLabel("First Guy")
          .setStyle(ButtonStyle.Primary)
      );

    cmd
      .reply({content : "Hello there!", components: [row as any]});
  },
  
  button(btn) {
    if (btn.customId.endsWith("000") ) {
      btn.reply("You clicked the first guy.");
      btn.message.delete();
    }
  }
} as Tinan.Command;