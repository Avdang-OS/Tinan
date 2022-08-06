import type {
  CommandInteractionOption, ChatInputCommandInteraction, Client,
  Message, 
} from 'discord.js';

declare global {
  var pollsList: Tinan.PollList
}

export namespace Tinan {
  interface PollList {
    [key: string]: unknown
  }
  
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
     * The name of the command: e.g. /[name]
     */
    name: string,

    /**
     * 
     */
    desctiption?: string,
    options?: _CommandInteractionOption[],
    callback(interaction: ChatInputCommandInteraction): Promise<void> | void
  }

  export interface DiscordEvent {
    callback(client: Client): Promise<void> | void;
  }

  export interface OtherEvent {
    name: string[],
    callback(message: Message): Promise<void> | void;
  }

  type ExtractMembers<T extends unknown[]> = T[number]; 

  interface OtherEventRegExp<T extends string[]> {
    name: RegExp[],
    callback(
      message: Message,
      args: Record<ExtractMembers<T>, string>
    ): Promise<void> | void;
  }
}
