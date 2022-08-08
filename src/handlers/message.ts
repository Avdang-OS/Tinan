import {
  Embed, EmbedBuilder, Message,
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
    this.#requirements = { pattern: 
      msg => {
        if (pattern instanceof RegExp) {
          return pattern.test(msg.content);
        }

        return msg.content.includes(pattern);
      }
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
          channelId: (msg : Message<boolean>) => {return msg.channelId === id; }
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
      is: (...userId: string[]) => {
        return RequirementGen("is")(
          msg => userId.some(id => msg.author.id === id),
          this
        );
      },
      hasRole: (...roles : string[]) => 
        RequirementGen("hasRole")(
          msg => roles.some(acceptableRole => msg.member?.roles.cache.find(r => r.id === acceptableRole)),
          this
        ),

      hasRoles: (...roles : string[]) =>
        RequirementGen("hasRoles")(
          msg => roles.every(acceptableRole => !!msg.member?.roles.cache.find(r => r.id === acceptableRole)),
          this
        ),

      hasPermission: (...permissions : PermissionResolvable[]) => 
        RequirementGen("hasPermission")(
          msg => permissions.some(acceptablePerm => !!msg.member?.roles.cache.find(r => r.id === acceptablePerm)),
          this
        ),

      hasPermissions: (...permissions : string[]) => 
        RequirementGen("hasPermissions")(
          msg => permissions.every(acceptablePerm => !!msg.member?.roles.cache.find(r => r.id === acceptablePerm)),
          this
        ),
    };
  }

  // ACTIONS

  /**
   * Reacts to the message if the requirements are met.
   * @param reactions String of reactions to react
   */
  react(reactions: string): this {
    this.#callback = async (msg) => {
      for (const emote of reactions) {
        await msg.react(emote);
      }
    };

    return this;
  }

  /**
   * Replies to the message if the requirements are met.
   * @param content the content of the reply message
   */
  reply(content: Parameters<typeof Message.prototype.reply>[0]): this {
    this.#callback = async (msg) => {
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

    console.group("REJECTION")
    console.log({msg, requirementResults})
  }

  /**
   * @DEBUG Proposes
   * 
   * Checks message against all requirements.
   * @param msg Discord Message to test against.
   * @returns Array of results in order of the requirements.
   */
  test(msg: Message): unknown  {
    let requirements = Object.entries(this.#requirements).map(([type, func]) =>
      [type, func] as [string, (msg : Message) => boolean]
    );

    for (const [type, func] of requirements) {
      if (!func(msg))
        return [type, func];
      return true;
    }
  }

  /**
   * @DEBUG
   * Prints out all requirements.
   */
  logRequirements() {
    console.log(this.#requirements);
  }
}
// i swear sammy invite me to the github repo or get into my fork because i inv'd you there!!!!!
// rember!! i know you can forger but please rember this important thing
// I HAVE THE AVDANG-OS THINGY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// we just forked alot of repos into 1 org with me and froxcey
// but please get into repo i invited you there!!!!!!!!! i have a branch ready for you and afterwards you can see ur changes in the grand PR