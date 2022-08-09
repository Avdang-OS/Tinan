import { Invertible, invertibleLookup } from "../utils/syntax";
import {
  Embed, EmbedBuilder, Message,
  PermissionFlagsBits,
  PermissionResolvable, TextChannel, User 
} from "discord.js";
export const EXEC_SYMBOL = Symbol.for("TINAN.MESSAGE.EXEC");

type Func<T> = (msg : Message) => Promise<boolean> | boolean;

const RequirementGen = (name : string) => (func : (msg : Message) => boolean, obj : MessageHandler) => {
  obj.requirements = {
    ...obj.requirements,
    [name] : func
  };

  return obj;
}

export class MessageHandler {
  #requirements: {pattern: Func<MessageHandler>} & { [k : string]: Func<MessageHandler>};
  #callback: (msg: Message) => Promise<void> = async () => {};

  get requirements() {
    return this.#requirements;
  }

  set requirements(r : {pattern: Func<MessageHandler>} & { [k : string]: Func<MessageHandler>}) {
    this.#requirements = r;
  }

  constructor(pattern: RegExp | string) {
    this.#requirements = {
      pattern: 
      msg => {
        if (pattern instanceof RegExp) {
          return pattern.test(msg.content);
        }

        return msg.content.includes(pattern);
      },
      // By default, do not respond to bots -- that ends badly...
      isNotBot:
        msg => !msg.author.bot
    };
  }

  // REQUIREMENTS

  /**
   * Adds the requirement for the message's channel to have a certain id.
   * @param channel The desired discord channel id.
   * @returns The handler object.
   */
  channel(channel: string) {

    return {
      hasId: (id : string) => {
        this.#requirements = {
          ...this.#requirements,
          channelId: (msg : Message<boolean>) =>
            invertibleLookup<string>(id => msg.channelId === id, id)
        };
      }
    }
  }

  /**
   * Checks if the message came from a specific discord user.
   *
   * Provides methods to choose details to check.
   */
  author() {
    return {

      /**
       * Checks if the message came from specific users with IDs or tags.
       * @param userIdOrName The users' Discord IDs or tags (Username#4738)
       */
      hasName: (...userIdOrName: string[]) => {
        return RequirementGen("hasName")(
          msg => userIdOrName.some(id =>
              invertibleLookup<string>(
                u => msg.author.id === u || msg.author.tag === u,
                id
              )
          ),
          this
        );
      },


      /**
       * Checks if the message came from specific users with IDs or tags.
       * @param userIdOrName The users' Discord IDs or tags (Username#4738)
       */
       hasNames: (...userIdOrName: string[]) => {
        return RequirementGen("hasNames")(
          msg => userIdOrName.every(id =>
              invertibleLookup<string>(
                u => msg.author.id === u || msg.author.tag === u,
                id
              )
          ),
          this
        );
      },

      /**
       * Checks if the author has one of these roles.
       * @param roles the roles to check for.
       */
      hasRole: (...roles : string[]) => 
        RequirementGen("hasRole")(
          msg => roles.some(
            roleToCheck =>
              invertibleLookup<string>(
                acceptableRole => !!msg.member?.roles.cache.find(r => r.id === acceptableRole),
                roleToCheck
              )
          ),
          this
        ),

      /**
       * Checks if author has *all* the desired roles. 
       * @param roles The roles to check for.
       * @returns 
       */
       hasRoles: (...roles : string[]) => 
        RequirementGen("hasRoles")(
          msg => roles.every(
            roleToCheck =>
              invertibleLookup<string>(
                acceptableRole => !!msg.member?.roles.cache.find(r => r.id === acceptableRole),
                roleToCheck 
              )
          ),
          this
        ),

      /**
       * Checks if the message author has one of the listed permissions.
       * @param permissions Permissions to check for.
       * @returns 
       */
      hasPermission: (...permissions : Invertible<keyof typeof PermissionFlagsBits>[]) => 
        RequirementGen("hasPermission")(
          msg => permissions.some(acceptablePerm => 
            invertibleLookup<keyof typeof PermissionFlagsBits>(
              perm => !!msg.member?.permissions.has(perm),
              acceptablePerm
            ),
          ),
          this
        ),

      /**
       * Checks if the message author has all of the listed permissions.
       * @param permissions Permissions to check for.
       * @returns 
       */
       hasPermissions: (...permissions : Invertible<keyof typeof PermissionFlagsBits>[]) => 
        RequirementGen("hasPermissions")(
          msg => permissions.every(acceptablePerm => 
            invertibleLookup<keyof typeof PermissionFlagsBits>(
              perm => !!msg.member?.permissions.has(perm),
              acceptablePerm
            ),
          ),
          this
        ),

    };
  }

  // ACTIONS

  /**
   * Reacts to the message if the requirements are met.
   * @param reactions String of reactions to react
   */
  react(reactions: string | string[]): this {
    this.#callback = async msg => {

      // Helper function because unicode hates me
      const reactMultEmojiString = async (possibleEmote : string) => {
        /*
           * @Sammy99jsp, What the heck are you doing with this match nonsense? 
           * The /./gui RegExp will hopefully not mangle the unicode glyphs
           * Unlike str.split("") or [...str]
           */
        for (const emoji of possibleEmote.match(/./gui) as RegExpMatchArray) {
          await msg.react(emoji)
            // This catch is because unicode is weird, and to not crash the bot for a weird character.
            .catch(err => console.warn("Invalid emoji code point!"));
        }
      }
      
      if (reactions instanceof Array) {
        for (const possibleEmote of reactions) {
          // Is this is a custom emote with this id ?
          if (/\d{19}/.test(possibleEmote)) {
            await msg.react(possibleEmote);
            continue;
          }
          
          // Other boring emoji
          await reactMultEmojiString(possibleEmote);
        }
      } else {
        await reactMultEmojiString(reactions);
      }

    };
// i will need proper epxlantion of tis
    return this;
  }

  /**
   * Replies to the message if the requirements are met.
   * @param content the content of the reply message
   */
  reply(content: Parameters<typeof Message.prototype.reply>[0]): this {
    this.#callback = async msg => {
      await msg.reply(content);
    };

    return this;
  }

  /**
   * Sends a message in the same channel as the original message.
   * @param content The contents of the reply message
   */
  send(content: Parameters<typeof TextChannel.prototype.send>[0]): this {
    this.#callback = async msg => {
      await msg.channel.send(content);
    };

    return this;
  }

  /**
   * Adds a custom handler, if all requirements are met.
   * @param customHandler The custom handler
   */
  handler(customHandler: (msg : Message) => Promise<void>) : this {
    this.#callback = customHandler;

    return this;
  }

  /**
   * NOT FOR PUBLIC USE
   * 
   * Executes this callback, if message meets requirements.
   * @param msg The discord message to check against.
   */
  async [EXEC_SYMBOL](msg: Message) : Promise<unknown> { 
    let requirementResults = this.test(msg) as true | [string, any];

    if (requirementResults === true) {
      await this.#callback(msg);
      return;
    }

    // console.group("REJECTION")
    // console.log({msg, requirementResults})
    // console.groupEnd()
  }

  /**
   * @DEBUG Proposes
   * 
   * Checks message against all requirements.
   * @param msg Discord Message to test against.
   * @returns Array of results in order of the requirements.
   */
  test(msg: Message): unknown {
    let requirements = Object.entries(this.#requirements).map(([type, func]) =>
      [type, func] as [string, (msg : Message) => boolean]
    );

    for (const [type, func] of requirements) {
      if (!func(msg)) return [type, func];
    }
    
    return true;
  }

  /**
   * @DEBUG
   * Prints out all requirements.
   */
  logRequirements() {
    console.log(this.#requirements);
  }
}
