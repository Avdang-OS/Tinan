import type {
  CommandInteractionOption, ChatInputCommandInteraction, Client,
  Message, 
} from 'discord.js';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
    }
  }
}

export namespace Tinan {  
  type _CommandInteractionOption = CommandInteractionOption & {
    description?: string,
    options?: _CommandInteractionOption[],
    required?: boolean
  }

  /**
   * Represents a Discord command.
   */
  export interface Command {
    /**
     * The name of the command. (e.g. /[name])
     */
    name: string,

    /**
     * The description of the command that appears under the name.
     */
    description?: string,

    /**
     * The options of the command.
     */
    options?: _CommandInteractionOption[],
    callback(interaction: ChatInputCommandInteraction): Promise<void> | void
  }

  /**
   * Represents a Discord event.
   */
  export interface DiscordEvent {
    callback(client: Client): Promise<void> | void;
  }

  /**
   * Represents a message event. (e.g 'honk')
   */
  export interface OtherEvent {
    name: string[],
    callback(message: Message): Promise<void> | void;
  }

  type ExtractMembers<T extends unknown[]> = T[number]; 

  /**
   * Represents a message event using regular expressions.
   */
  interface OtherEventRegExp<T extends string[]> {
    name: RegExp[],
    callback(
      message: Message,
      args: Record<ExtractMembers<T>, string>
    ): Promise<void> | void;
  }
}
