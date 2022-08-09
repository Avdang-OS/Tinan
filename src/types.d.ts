import type { ButtonInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
    }
  }
}

export namespace Tinan {
  export interface Command {
    options: SlashCommandBuilder,
    interaction : (cmd : ChatInputCommandInteraction) => Promise<void>; 
    button ?: (btn : ButtonInteraction) => Promise<void>;
  }
}