import type { Tinan } from "@/types";
import { Error } from "../utils/embeds";
import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, CommandInteraction, Embed, EmbedBuilder, GuildMemberRoleManager, Message, SlashCommandBuilder, SlashCommandStringOption, TextBasedChannel, TextChannel, ThreadChannel, User } from "discord.js";
import moment, { Moment } from "moment";
import { v4 as uuid } from "uuid";
import CONFIG from "../../config/loa.json";

// TODO: Make LoaRequestStore save to permanent on-disk storage.

type LoaRquestStatus = "approved" | "denied" | "to review";

class LoaRequestStore {
  private store : { [id : string ] :  LoaRequest } = {};
  
  add(req : LoaRequest) {
    this.store[req.id] = req;
  }

  get(id: string) : LoaRequest | undefined {
    return this.store[id];
  }

  getByMsgId(id : string) : LoaRequest | undefined {
    return Object.values(this.store)
      .find(r => r.originalMsg() === id);
  }

  async getFromCmd(cmd : ChatInputCommandInteraction) : Promise<LoaRequest | undefined> {
    const errorEmbed = Error()
      .setTitle("Command Error")
      .setDescription("Provide the LOA Request's id or try this command in a LOA discussion thread.");
    let uuid = cmd.options.getString("id");
    if (!uuid) {
      if (!cmd.channel?.isThread()) {
        await cmd.reply({
          embeds: [
            errorEmbed
          ],
          ephemeral: true
        });
        return
      }

      let originalMsgId = (await cmd.channel.fetchStarterMessage()).id;
      return STORE.getByMsgId(originalMsgId);
    }

    return this.get(uuid);
  }
}

class LoaRequest {
  private _id          : string;
  private _user        : {
    id     : string,
    avatar : string,
    name   : string,
  };
  private _reason      : string;
  private _start       : number;
  private _end         : number;
  private _msg        ?: string;

  private _status       : LoaRquestStatus = "to review";


  constructor({
    user, reason, start, end
  } : { user : User, reason: string, start : Moment, end: Moment}) {
    this._id = uuid().replaceAll("-", "_");
    this._user = {
      id      : user.id,
      name    : user.tag,
      avatar  : user.avatarURL() ?? ""
    };
    this._reason = reason;

    if (!start.isValid()) 
      throw { title: "Format Error", description: "Invalid format for start date." };

    if (!end.isValid()) 
      throw { title: "Format Error", description: "Invalid format for end date." };

    if (start.unix() > end.unix())
      throw { title: "Date Error", description: "End date is before start date." };

    if (start.unix() < moment.utc().subtract(1, "day").unix())
      throw { title: "Date Error", description: "Start date is before today."};

    if (end.unix() < moment.utc().subtract(1, "day").unix())
      throw { title: "Date Error", description: "End date is before today."};


    this._start = start.unix();
    this._end = end.unix();
  }

  get start() {
    return moment.unix(this._start);
  }

  get end() {
    return moment.unix(this._end);
  }

  duration() {
    return moment.duration(this.end.diff(this.start));
  }

  embed() {
    return new EmbedBuilder()
      .setTitle(`LOA Request`)
      .setDescription(`**Reason**:\n${this._reason}`)
      .setAuthor({ name: this._user.name, iconURL: this._user.avatar })
      .addFields([
        { name: "Start Date", value: this.start.format("YYYY-MM-DD"), inline: true },
        { name: "End Date", value: this.end.format("YYYY-MM-DD"), inline: true },
        { name: "Duration", value: `${this.duration().asDays()} days`, inline: true },
      ])
      .setFooter({ text: `ID: ${this._id}` })
      .setColor(this.color())
  }

  color() {
    switch (this._status) {
      case "approved":
        return Colors.Green;
      case "denied":
        return Colors.Red;
      case "to review":
        return Colors.Blue;
    }
  }

  get id() {
    return this._id;
  }

  registerMsg(msg_id : string) {
    this._msg = msg_id;
  }

  get status() {
    return this._status;
  }

  set status(status : LoaRquestStatus) {
    this._status = status;
  }

  originalMsg() {
    return this._msg;
  }

  async reviewUpdate(channel : TextBasedChannel, reviewer: User) {
    console.log({msg : this.originalMsg()});
    
    let msg;
    let thread;
    if (channel.isThread()) {
      msg = await channel.fetchStarterMessage();
      thread = channel;
    } else {
      msg = await channel?.messages.fetch({message : this.originalMsg() as string});
      thread = (await channel?.messages.fetch(this.originalMsg() as string))
        ?.thread as ThreadChannel;

    }
      
    msg?.edit({
      embeds: [
        this.embed()
          .addFields([
            { name: "Last Reviewed By:", value: `${reviewer}` },
            { name: "Status", value: this.status.toUpperCase() },
          ])
      ],
      components: this.status === "to review" ? [this.actionButtons()] : []
    });
      
      if (this.status === "to review") {
        await thread.setArchived(false);
        await thread.send("***LOA review reopened***");
      } else {
        await thread.send("***LOA reviewed -- Archiving Thread***");
        await thread.setArchived(true);
    }
  }

  actionButtons() : any {
    return (
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel("Approve")
            .setCustomId(`loa-${this.id}-approve`)
            .setStyle(ButtonStyle.Secondary),
          
          new ButtonBuilder()
            .setLabel("Deny")
            .setCustomId(`loa-${this.id}-deny`)
            .setStyle(ButtonStyle.Secondary)
        )
    )
  }


}

const STORE = new LoaRequestStore();

// Used for /loa approve and /loa deny
async function inContextReview(cmd : ChatInputCommandInteraction, status: LoaRquestStatus) {
  let loa = await STORE.getFromCmd(cmd);
  if(loa === undefined)
    cmd.reply({
      embeds: [
        Error()
          .setTitle("Not Found")
          .setDescription("No LOA request was found from the id provided or thread context.")
      ]
    });

  let l = loa as LoaRequest;
  
  l.status = status;

  l.reviewUpdate(cmd.channel as TextChannel, cmd.user);
}

export default {
  options:
    new SlashCommandBuilder()
      .setName("loa")
      .setDescription("Collection of commands to do with LOA requests.")
      .addSubcommand(sub =>
        sub
          .setName("apply")
          .setDescription("Apply for a Leave of Absence (LOA).")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("reason")
              .setDescription("The reason for your LOA.")
              .setMaxLength(150)
              .setRequired(true)
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName("start_date")
              .setDescription("The date your LOA would start in YYYY-MM-DD format (e.g. 2022-08-09).")
              .setRequired(true)
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName("end_date")
              .setDescription("The date your LOA would end in YYYY-MM-DD format (e.g. 2022-10-29).")
              .setRequired(true)
          )
      )
      .addSubcommand(sub => 
        sub
          .setName("deny")
          .setDescription("Reject an LOA Request by its id or within its discussion thread.")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("id")
              .setDescription("The LOA request's unique id (found in the embed's footer)")
              .setRequired(false)
          )  
      )
      .addSubcommand(sub => 
        sub
          .setName("approve")
          .setDescription("Accept an LOA Request by its id or within its discussion thread.")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("id")
              .setDescription("The LOA request's unique id (found in the embed's footer)")
              .setRequired(false)
          )  
      )
      .addSubcommand(sub => 
        sub
          .setName("reopen")
          .setDescription("Reopen an LOA Request's discussion by its id or within its discussion thread.")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("id")
              .setDescription("The LOA request's unique id (found in the embed's footer)")
              .setRequired(false)
          )  
      ),
      async command(cmd) {

        if (cmd.member?.roles) {
          let r = cmd.member.roles as GuildMemberRoleManager;
          if (!r.cache.has(CONFIG.ROLES.ELIGIBLE)) {
            await cmd.reply({
              embeds: [
                Error()
                  .setTitle("Permission Error")
                  .setDescription("You do not have permissions to use this command.")
              ]
            });
            return;
          }
        }

        

        switch (cmd.options.getSubcommand(true)) {
          case "apply":

            if (cmd.channel?.isThread()) {
              cmd.reply({
                embeds: [
                  Error()
                    .setTitle("Command error")
                    .setDescription("You cannot run this command in threads!")
                ]
              });
              return;
            }


            let [reason, startRaw, endRaw] = [
              cmd.options.getString("reason", true),
              cmd.options.getString("start_date", true),
              cmd.options.getString("end_date", true),
            ];

            

            let [start, end] = [startRaw, endRaw].map(
              raw => moment.utc(raw, "YYYY-MM-DD")
            );


            try {
              let loa = new LoaRequest({
                user : cmd.user,
                start,
                end,
                reason
              });

              let m = await cmd.reply({ 
                embeds: [loa.embed()],
                components: [
                  loa.actionButtons()
                ],
                fetchReply: true
              });

              let discussion = await m.startThread({
                name: `LOA - ${cmd.user.tag}`,
              });

              discussion.send({
                content: `<@&${CONFIG.ROLES.REVIEW}> please review and discuss ${cmd.user}'s LOA request here.\nThank you!\n`
                  + "\n"
                  + "*Reminder*: You can also use `/loa approve`, `/loa deny`, `/loa reopen` in discussion threads."
              });

              loa.registerMsg(m.id);

              STORE.add(loa);

            } catch(e : any) {

              if(!e.description && !e.title) {
                throw e;
              }

              const { title, description } = e;

              cmd
                .reply({
                  embeds: [
                    Error()
                      .setTitle(<string>title)
                      .setDescription(<string>description)
                      .setFooter({ text: cmd.toString() })
                  ],
                })
            }

            break;
          case "approve":
            inContextReview(cmd, "approved");
            cmd.reply({
              content: "Action completed successfully.",
              ephemeral: true
            })
            break;
          case "deny":
            inContextReview(cmd, "denied");
            cmd.reply({
              content: "Action completed successfully.",
              ephemeral: true
            })
            break;
          case "reopen":
            inContextReview(cmd, "to review");
            cmd.reply({
              content: "Action completed successfully.",
              ephemeral: true
            })
            break;

        }
      },
      async button(btn) {
        const [, id, action] = btn.customId.split("-");

        let loa = STORE.get(id);

        if (loa == undefined) {
          btn.reply({ content: "No Loa Request with that ID exists!", ephemeral: true });
        }

        console.log([id, action])

        if(!(btn.member?.roles as GuildMemberRoleManager).cache.has(CONFIG.ROLES.REVIEW)) {
          btn.reply({
            embeds: [
              Error()
                .setTitle("Permission Error")
                .setDescription("You do not have permission to review LOAs.")
            ],
            ephemeral: true
          });
          return;
        }

        let l = loa as LoaRequest;

        switch (action) {
          case "approve":
            l.status = "approved";
            break;
          case "deny":
            l.status = "denied";
            break;
        }

        await l.reviewUpdate(btn.channel as TextChannel, btn.user);
        
        if(l.status == "approved") {         
          btn.reply({ content: "Marked LOA as approved.", ephemeral: true });
        }
      }

} as Tinan.Command