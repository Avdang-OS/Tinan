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
    /**
     * Handles any {@link ChatInputCommandInteraction} events.
     */
    command : (cmd : ChatInputCommandInteraction) => Promise<void>; 
    button ?: (btn : ButtonInteraction) => Promise<void>;
  }
}