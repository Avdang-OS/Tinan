import type { Tinan } from "@/types";
import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonStyle, EmbedBuilder, GuildMemberRoleManager, SlashCommandBuilder, SlashCommandRoleOption, SlashCommandStringOption } from "discord.js";
import { v4 as uuid } from "uuid";

interface ElectionRoles {
  stand : string,
  vote  : string,
}

class Election {
  /**
   * Members standing for election.
   */
  private participants: string[] = [];

  /**
   * Title of the election
   */
  private title   : string;

  /**
   * Roles needed to stand and/or vote in the election.
   */
  private role    : ElectionRoles;

  /**
   * The person that called this election.
   */
  private officer : string;

  constructor({
    title, role, officer
  } : { title: string, role : ElectionRoles, officer: string, }) {
    this.officer = officer;
    this.title = title;
    this.role = role;
  } 

  stand(user: string) {
    this.participants.push(user);
  }

  getTitle() {
    return this.title;
  }

  roles() {
    return this.role;
  }

  isRunning(user : string) : boolean {
    return this.participants.includes(user);
  }

  embed() {
    return (
      new EmbedBuilder()
        .setTitle(this.getTitle())
        .setDescription(
          `A new election will soon begin.\n` +
          `Stand for this election using the button below.\n`
        )
        .addFields(
          { name: "Members Standing:", value: `(${this.participants.length})\n${
            this.participants.map(id => `<@${id}>`).join(" ")
          }` },
          { name: "Eligible to Stand:", value: `<@&${this.roles().stand}>` },
          { name: "Eligible to Vote:", value: `<@&${this.roles().vote}>` }
        )
        .setFooter({
          text: "From Tinan"
        })
    )
  }
}

const elections : {
  [k: string] : Election
} = {};

export default {
  options: 
    new SlashCommandBuilder()
      .setName("election")
      .setDescription("Commands for elections")
      .addSubcommand(cmd => 
        cmd
          .setName("create")
          .setDescription("Create a new election.")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("title")
              .setDescription("The name of the election")
              .setMaxLength(50)
              .setAutocomplete(false)
              .setRequired(true)
          )
          .addRoleOption(
            new SlashCommandRoleOption()
              .setName("stand_role")
              .setDescription("The minimum rank needed to stand in this election.")
              .setRequired(true)
          )
          .addRoleOption(
            new SlashCommandRoleOption()
              .setName("vote_role")
              .setDescription("The minimum rank needed to vote in this election.")
              .setRequired(true)
          )
      ),

    
  interaction(cmd) {
    switch (cmd.options.getSubcommand()) {
      case "create":

        const id = uuid().replaceAll("-", "_");
        const electionObj = new Election({
          title : cmd.options.getString("title", true),
          role  : {
            stand : cmd.options.getRole("stand_role", true).id, 
            vote  : cmd.options.getRole("vote_role", true).id 
          },
          officer : cmd.user.id,
        });

        elections[id] = electionObj;

        
        const actions = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel("Stand")
              .setStyle(ButtonStyle.Secondary)
              .setCustomId(`election-${id}-stand`)
          );

        cmd.reply({content: "", embeds: [electionObj.embed()], components: [actions as any], allowedMentions: { users : []} });
        break;
    }
  },
  
  button(btn) {
    const [, id, action] = btn.customId.split("-");

    if(!elections[id]) {
      btn.reply({content: "Invalid election id! No election by that id exists!", ephemeral: true});
      return;
    }

    let elec = elections[id];

    switch (action) {
      case "stand":
        // Is the user eligible to stand in this election?
        let r = btn.member?.roles as GuildMemberRoleManager;

        if (elec.isRunning(btn.user.id)) {
          btn.reply({ content: "You are already running in this election!", ephemeral: true });
          return;
        }

        if (r?.cache?.has(elec.roles().stand)) {
          // Is eligible
          elec.stand(btn.user.id);
          btn.message.edit({
            embeds: [elec.embed()],
            allowedMentions: {
              users: []
            }
          })
          btn.reply({ content: "You have been successfully enrolled in this election.", ephemeral: true });
          return;
        } 
        
        btn.reply({ content: "You do not have adequate permissions to stand in this election!", ephemeral: true });
        break;
    }


    if (btn.customId.endsWith("000") ) {
      btn.reply("You clicked the first guy.");
      btn.message.delete();
    }
  }
} as Tinan.Command;